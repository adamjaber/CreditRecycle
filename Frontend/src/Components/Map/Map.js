import React, { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import mapStyling from './mapStyling.json'
import UtilService from '../../Services/util.service';
import { MdLocationPin } from 'react-icons/md';
import classes from './Map.module.css';
import Popup from 'reactjs-popup';
import TrashInformation from '../TrashInformation/Trashinformation';
import RecycleBinService from '../../Services/recycleBin.service';
const API_URL = "AIzaSyCfQnCX3PV7kU6TC2X0oUSNvyUQtSSILB0";

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const options = {
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: mapStyling
}
function Map(props) {
    const [map, setMap] = useState(null);
    const [origin, setOrigin] = useState({ lat: 32.089433, lng: 34.80363 });
    const [zoom, setZoom] = useState(17);
    const [bins, setBins] = useState([]);
    const [markers, setMarkers] = useState(null);
    const [currentBin, setCurrentBin] = useState({});
    const [openInfo, setOpenInfo] = useState(false);
    const [destination, setDestination] = useState('');
    const [response, setResponse] = useState(null);
    const travelMode = 'WALKING';
    
   
    useEffect(() => {
        setDestination(props.destination ?? '');
    }, [props]);



    const directionsCallback = (newRoute) => {
        
        console.log("response route", newRoute);
        console.log("response route", newRoute.geocoded_waypoints[1].place_id);

        if (newRoute !== null) {
            if (newRoute.status === 'OK') {
                if(!response ||newRoute.geocoded_waypoints[1].place_id !==response.geocoded_waypoints[1].place_id){
                    setResponse(newRoute);
                }
            } else {
                console.error('response: ', newRoute)
            }
        }
    }

    const panToLocation = async () => {
        try {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              setOrigin({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              let city = await UtilService.fetchAddress(position.coords.latitude, position.coords.longitude);
              localStorage.setItem('userCity', city.split(', ')[1]);
            //   console.log(JSON.parse(localStorage.getItem('userCity')));
              console.log((localStorage.getItem('userCity')));
            });
          }
        } catch (err) {
          console.error('Error:', err);
          return null;
        }
      };
      

    const loadBins = async () => {
        let result;
        try {
            result = await RecycleBinService.getBins();
        } catch (err) {
            console.log(`${err}`);
            return;
        }
        let activeBins = []
        result.data.map((bin, i) => {
            if (bin.status == 'active') {
                activeBins.push(bin);
            }
        })
        setBins(activeBins);
    };

    useEffect(() => {
        loadBins();
    }, []);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_URL
    })


    const onLoad = useCallback(function callback(map) {
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    useEffect(() => {
        panToLocation();
    }, [map]);

    useEffect(() => {
        if (map) {
            map.panTo(origin)
            setZoom(17);
        }
    }, [origin, map])

    useEffect(() => {
        setMarkers(bins.map((bin, i) => {
            return <Marker key={i + 1}
                bin={bin}
                onClick={() => updateCurrentBin(bin)}
                position={bin.location}
                icon={require(`../../Images/icons/other-bin.png`)}
            />
        }))
        setZoom(17);
    }, [bins]);

    const updateCurrentBin = (bin) => {
        console.log("here");
        setCurrentBin(bin);
        setOpenInfo(true);
    };

    const closeInfo = () => {
        setOpenInfo(false);
    }

    const setDest = (lat, lng) => {
        setDestination(`${lat}, ${lng}`);
    }

    return isLoaded ? (
        <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={origin}
                zoom={zoom}
                options={options}
            >

                <Marker key={0}
                    position={origin}
                    icon={require(`../../Images/icons/location2.png`)}
                />
                {markers}

                {
                    (
                        destination !== '' && origin
                    ) && (
                        <DirectionsService
                            options={{
                                destination: destination,
                                origin: `${origin.lat}, ${origin.lng}`,
                                travelMode: travelMode,

                            }}
                            callback={directionsCallback}
                        />
                    )
                }
                {
                    response !== null && (
                        <DirectionsRenderer
                            options={{
                                directions: response
                            }}
                        />
                    )
                }
            </GoogleMap>
            <div className={classes.pan} onClick={panToLocation}>
                <MdLocationPin size={35} style={{ verticalAlign: 'middle' }} />
            </div>

            <Popup open={openInfo} onClose={closeInfo} modal>
                <TrashInformation bin={currentBin} onNav={setDest} />
            </Popup>

        </>
    ) : <></>
}

export default Map;//React.memo(MyComponent)