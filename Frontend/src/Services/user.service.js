import axios from 'axios';
import AuthService from './auth.service';
import UtilService from './util.service';
import RecycleBinService from './recycleBin.service';
const API_URL = 'https://credit-recycle.com:7000/api/users/';

// Get all users with an optional query parameter
const getUsers = (query = '') => {
  return axios.get(API_URL + query, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};

// Get a specific user by ID
const getUser = (id) => {
  return axios.get(API_URL + id, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};

// Add an activity for the current user
const addActivity = (dateTime, recycleBinID, type, address) => {
  return axios.post(API_URL + AuthService.getCurrentUser().id + '/activities/', {
    dateTime,
    recycleBinID,
    type,
    address
  }, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};

// Update the current user's data
const updateCurrentUser = (recycleFlag) => {
  const currentUser = AuthService.getCurrentUser();
  getUser(currentUser.id).then(async (response) => {
    if (response.data.name) {
      localStorage.setItem('user', JSON.stringify({ id: response.data._id, ...response.data, accessToken: currentUser.accessToken }));
      if (recycleFlag) {
        let lastActivity = response.data.activities[response.data.activities.length - 1];
        const activities = AuthService.getCurrentUserActivities();
        let address;
        let lat;
        let lng;
        address = await RecycleBinService.getBin(lastActivity.recycleBinID);
        lat = address.data.location.lat;
        lng = address.data.location.lng;
        address = await UtilService.fetchAddress(lat, lng);
        lastActivity.address = address;
        activities.push(lastActivity);
        localStorage.setItem('userActivities', JSON.stringify(activities));
      }
    }
    return response.data;
  });
};

// Update the profile of a user
const updateProfileUser = (_id, name, email, password, imgUrl, age, gender) => {
  return axios.put(API_URL + _id + '/updateProfileUser/', {
    name,
    email,
    password,
    imgUrl,
    age,
    gender
  }, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};

// Update the data of a municipal user
const updateMunicipal = (_id, name, email, password, imgUrl, city, userType) => {
  return axios.put(API_URL + _id + '/updateUser/', {
    name,
    email,
    password,
    imgUrl,
    city,
    userType
  }, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};

// Add a new municipal user
const addMunicipal = (name, email, password, imgUrl, city, userType) => {
  return axios.post(API_URL + AuthService.getCurrentUser().id + '/addMunicipal/', {
    name,
    email,
    password,
    imgUrl,
    city,
    userType
  }, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};

// Delete a user by ID
const deleteUser = (id) => {
  return axios.delete(API_URL + id + '/deleteUser/', {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};


// Add a new municipal user
const addReport = (reason , description ,email , phone ,  selectedBin) => {
  return axios.post(API_URL + AuthService.getCurrentUser().id + '/report/', {
    reason,
    description,
    email,
    phone,
    selectedBin,
  }, {
    headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
  });
};
const UserService = {
  getUsers,
  getUser,
  addReport,
  addActivity,
  updateCurrentUser,
  addMunicipal,
  updateMunicipal,
  updateProfileUser,
  deleteUser
};

export default UserService;
