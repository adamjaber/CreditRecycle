
# CreditRecycle

The CreditRecycle system is designed to incentivize and enable recycling by providing a 
convenient and user-friendly way to recycle, and by rewarding users for every item they recycle. 

The system comprises smart recycling bins that are equipped with image recognition technology. These bins will be installed throughout the city and can detect the type of bottles and cans placed inside, which are then separated into categories such as plastic, glass, and aluminum.

As soon as the user finishes recycling, the user will receive points in a digital wallet through the mobile application, and the app will also show the location of the smart recycling bins and provide recycling statistics.


## Deployment

To deploy this project run

#Backend

- fill the “.env” fields with proper values.
- install NodeJs v18.16.0 and NPM to the host machine.
- install Python 3.10 and pip.
- install all required pip packages mentioned in “python/requirements.txt”:
- “python3 pip install -r requirements.txt”.
- Run “npm install” script to install all the dependencies.
- When ready, run “npm run dev” to start the backend server.

#Frontend

- install NodeJs v18.16.0 and NPM to the host machine.
- Run “npm install” script to install all the dependencies.
- In “Services/auth.service.js” & “Services/recycleBin.service.js” & “Services/user.service.js” files please change the “API_URL” accordingly to the host machine IP.
- Run “npm run build” to compile the frontend files into a static build
- Run “serve -s build” to start the frontend



# Link for Demo : https://credit-recycle.com/


