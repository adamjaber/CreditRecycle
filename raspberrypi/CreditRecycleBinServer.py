#!/usr/bin/python3
from flask import Flask,  request
import requests
from datetime import datetime
from ultralytics import YOLO
import cv2
from time import sleep
import time
import RPi.GPIO as GPIO
import json
from gpiozero import Servo
from gpiozero.pins.pigpio import PiGPIOFactory
import urllib3
import supervision as sv
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
pigpio_factory = PiGPIOFactory()
servoArm = Servo(19,  pin_factory=pigpio_factory, min_pulse_width=0.5/1000, max_pulse_width=2.5/1000)
servoDoor = Servo(12,  pin_factory=pigpio_factory, min_pulse_width=0.5/1000, max_pulse_width=2.5/1000)
import pygame.camera
import pygame.image
import numpy as np
import threading  # Import the threading module for creating a separate thread

pygame.camera.init()

import logging

# Configure the logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='recycling_app.log',
    filemode='w'
)
logger = logging.getLogger()
def setRotate(angle):
    print(f'Rotate {angle} degree')
    global servoArm
    servoArm.value = angle / 360
    sleep(1)


def setDoor(angle):
    print(f'SetDoor {angle} degree')
    global servoDoor
    servoDoor.value = angle / 360
    sleep(1)


CENTER=-30
CENTER_CELL=0
MAX_LEFT=90
MAX_RIGHT=-120
SEC_CELL=-60
DOOR_OPEN=-100
DOOR_CLOSE=30

plasticCapacity=0
canCapacity=0
glassCapacity=0

cameras = pygame.camera.list_cameras()
webcam = pygame.camera.Camera(cameras[0])
webcam.start()

from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://credit-recycle.com/"}}, allow_headers='*')
flag = False
recycledItems = {"c": 0, "g": 0, "p": 0}
totalBottles=0
bottlesImages={"can": [], "glass": [], "plastic": []}
local_saved_data = []  # List to store locally saved data

    
def setup():

    # GPIO Mode (BOARD / BCM)
    GPIO.setmode(GPIO.BCM)
    # set GPIO direction (IN / OUT)
    # bottle distance
    GPIO.setup(21, GPIO.OUT)
    GPIO.setup(20, GPIO.IN)
    
    # Plastic capacity distance #
    GPIO.setup(26, GPIO.OUT)
    GPIO.setup(19, GPIO.IN)
    
    # Glass capacity distance #
    GPIO.setup(13, GPIO.OUT)
    GPIO.setup(6, GPIO.IN)
    
    # Can capacity distance #
    GPIO.setup(5, GPIO.OUT)
    GPIO.setup(11, GPIO.IN)


    model = YOLO('/home/project/train1-v9-640-100epchs-no-agumentetion/weights/best.pt')  # load a custom trained

    return model


## MODEL SETUP ###
model = setup()


def distance_sensor(GPIO_TRIGGER, GPIO_ECHO):

    # set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)

    # set Trigger after 0.01ms to LOW
    sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    StartTime = time.time()
    StopTime = time.time()

    # save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()

    # save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    # time difference between start and arrival
    TimeElapsed = StopTime - StartTime
    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    distance = (TimeElapsed * 34300) / 2

    return distance

def create_presigned_post(bucket_name, object_name, fields=None, conditions=None, expiration=3600):
    """Generate a presigned URL S3 POST request to upload a file

    :param bucket_name: string
    :param object_name: string
    :param fields: Dictionary of prefilled form fields
    :param conditions: List of conditions to include in the policy
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Dictionary with the following keys:
        url: URL to post to
        fields: Dictionary of form fields and values to submit with the POST
    :return: None if error.
    """

    # Generate a presigned S3 POST URL
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_post(bucket_name, object_name, Fields=fields, Conditions=conditions, ExpiresIn=expiration)

    except ClientError as e:
            print(e)
            return None

    # The response contains the presigned URL and required fields
    return response

def upload_to_s3(imageName,presignedUrl):
    with open(imageName, 'rb') as f:
        files = {'file': (imageName, f)}
        s3_response = requests.post(presignedUrl['url'], data=presignedUrl['fields'], files=files)
        return s3_response.content

def bottle_recognition(screen, box_annotator):
    global model
    global totalBottles
    global recycledItems
    global bottlesImages
    classes = ["c", "g", "o", "p"]

    try:
        logger.info('Starting bottle recognition')
        result = model("predicted.jpg", max_det=1, agnostic_nms=True)[0]
        detections = sv.Detections.from_yolov8(result)
        labels = [
            f"{classes[class_id]} {confidence:0.2f}"
            for _, _, confidence, class_id, _
            in detections
        ]
        im = cv2.imread("predicted.jpg")
        frame_a = box_annotator.annotate(
            scene=im, 
            detections=detections, 
            labels=labels
        ) 
        logger.info('Displaying annotated image')
        cv2.imwrite("predicted_box.jpg", frame_a)
        predicted_Surface = pygame.image.load("predicted_box.jpg")
        screen.blit(predicted_Surface, (0,0))
        pygame.display.flip()

        if len(detections.class_id) > 0:
            predicted = classes[int(detections.class_id)]
            if predicted == 'p':
                logger.info('Detected plastic bottle')
                setRotate(MAX_LEFT)  ## 4 max left
                bottlesImages['plastic'] = upload_to_s3('predicted.jpg', create_presigned_post('creditRecycle/plastic','predicted.jpg'))
            elif predicted == 'g':
                logger.info('Detected glass bottle')
                setRotate(CENTER_CELL)  ## 3 center
                bottlesImages['glass'] = upload_to_s3('predicted.jpg', create_presigned_post('creditRecycle/plastic','predicted.jpg'))
            elif predicted == 'c':
                logger.info('Detected can')
                setRotate(SEC_CELL)  ## 3 center
                bottlesImages['can'] = upload_to_s3('predicted.jpg', create_presigned_post('creditRecycle/plastic','predicted.jpg'))
            else:
                logger.info('Detected other item')
                setRotate(MAX_RIGHT)  ## 1 max right
        else:
            logger.info('No detection made, uploading as other')
            setRotate(MAX_RIGHT)  ## 1 max right
            upload_to_s3('predicted.jpg', create_presigned_post('creditRecycle/other', 'predicted.jpg'))

        if predicted != 'o':
            recycledItems[predicted] += 1
            totalBottles += 1

        setDoor(DOOR_OPEN)  ## Door open
        setDoor(DOOR_CLOSE)  ## Door close
        setRotate(CENTER)  ## 3 center

    except Exception as e:
        logger.error(f'Error in bottle recognition: {str(e)}')




@app.route('/api/recycleBins/start')
def start():
    try:
        logger.info('Recycling process started')
        global flag
        box_annotator = sv.BoxAnnotator(
            thickness=2,
            text_thickness=2,
            text_scale=1
        )
        img = webcam.get_image()
        WIDTH = img.get_width()
        HEIGHT = img.get_height()
        screen = pygame.display.set_mode( ( WIDTH, HEIGHT ) )
        pygame.display.set_caption("pyGame Camera View")       
        binId = request.args.get('binId')
        userId = request.args.get('userId')
        is_object_detected=False
        if (flag == True):
            flag = False
        while flag == False:
            # ret, frame = cap.read()
            frame = webcam.get_image()
            
            dist = distance_sensor(21, 20)
            if (dist < 13 or dist > 16):
                frame = webcam.get_image()
                screen.blit(frame, (0,0))
                pygame.display.flip()
                dist = distance_sensor(21, 20)
                if (dist < 13 or dist > 16):
                    is_object_detected = True

            if (is_object_detected ):  
                for i in range(10):
                    frame = webcam.get_image()
                    screen.blit(frame, (0,0))
                    pygame.display.flip()
                pygame.image.save(frame, "predicted.jpg")
                bottle_recognition(screen, box_annotator)
                is_object_detected = False

            else:
                screen.blit(frame, (0,0))
                pygame.display.flip()
    
        flag = False
        logger.info('Recycling process completed successfully')
        return "Recycle has been finished"
    except Exception as e:
        logger.error(f'Error during recycling process: {str(e)}')   

def upload_or_save_locally(userId,data):
    try:
        response = requests.post(f"https://credit-recycle.com:7000/api/users/{userId}/activities/", headers={"x-access-token": request.headers['x-access-token'], 'Content-Type': 'application/json'}, data=data, verify=False)
        res = response.json()
        return True, res['points']
    except Exception as e:
        logger.error(f'Error during data upload: {str(e)}')
        return False, None

# Thread to periodically check and upload locally saved data
def upload_local_data():
    while True:
        if local_saved_data and is_internet_available():
            for saved_data in local_saved_data:
                upload_success, points = upload_or_save_locally(saved_data['data'])
                if upload_success:
                    logger.info(f'Locally saved data uploaded successfully: {saved_data["type"]}')
                    local_saved_data.remove(saved_data)
        sleep(60)  # Check every minute

# Function to check if there's internet connectivity
def is_internet_available():
    try:
        response = requests.get("https://www.google.com", timeout=5)
        return True
    except Exception:
        return False

# Start the thread to upload local data
upload_thread = threading.Thread(target=upload_local_data)
upload_thread.daemon = True
upload_thread.start()

@app.route('/api/recycleBins/stop')
def stop():
    try:
        logger.info('Recycling process stopped')
        global flag
        global recycledItems
        global totalBottles
        global bottlesImages
        global plasticCapacity
        global canCapacity
        global glassCapacity
        
        pygame.quit()

        binId = request.args.get('binId')
        userId = request.args.get('userId')
        now = datetime.now()
        recycledItems_send = recycledItems.copy()
        bottlesImages_send =bottlesImages.copy()
        flag = True
        
        recycledItems = {"c": 0, "g": 0,"p": 0}
        bottlesImages={"can": [], "glass": [], "plastic": []}
        
        plasticCapacity = distance_sensor(26, 19)
        canCapacity = distance_sensor(5, 11)
        glassCapacity = distance_sensor(13, 6)
        
        activityData = {
            "dateTime": now.strftime("%d/%m/%Y %H:%M"),
            "recycleBinID": binId,
            "totalBottles": totalBottles,
            "items": [
                {
                    "itemName": "plastic",
                    "quantity": recycledItems_send['p'],
                    "imagesUrl": bottlesImages_send["plastic"]
                },
                {
                    "itemName": "can",
                    "quantity": recycledItems_send['c'],
                    "imagesUrl":  bottlesImages_send["can"]
                },
                {
                    "itemName": "glass",
                    "quantity":   recycledItems_send['g'],
                    "imagesUrl":  bottlesImages_send["glass"]
                }
            ],
            ## need to change the parameters to the relevant sensor
            "capacity": {
                "plastic": plasticCapacity , 
                "can": canCapacity,
                "glass": glassCapacity
            }
        }
        logger.info(f'Attempting to upload data: {activityData}')
        activityData=json.dumps(activityData)
        upload_success, points = upload_or_save_locally(userId,activityData)
        if upload_success:
            logger.info('Recycling process data sent successfully')
        else:
            logger.warning('Data upload failed, saving locally')
            local_saved_data.append({'type': 'activity', 'data': activityData})

        print(points)  # Print the points if the upload was successful
        totalBottles = 0
        plasticCapacity = 0
        canCapacity = 0
        glassCapacity = 0
        logger.info('Recycling process data sent successfully')
        return f"{points}"
    except Exception as e:
        logger.error(f'Error during stopping recycling process: {str(e)}')



if __name__ == "__main__":
    try:
        logger.info('Recycling app started')
        setDoor(DOOR_CLOSE)  ## Door close
        setRotate(CENTER)  ## 3 center
        app.run(host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f'Error during app execution: {str(e)}')
    finally:
        pygame.quit()
        logger.info('Recycling app stopped')
