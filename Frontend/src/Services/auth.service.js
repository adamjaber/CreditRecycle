import axios from 'axios';
import UtilService from './util.service';
import RecycleBinService from './recycleBin.service';
const API_URL = 'https://credit-recycle.com:7000/api/auth/';

// Register a new user
const register = (email, password, name, age, gender, imgUrl) => {
  return axios.post(API_URL + 'signup', {
    email,
    password,
    name,
    age,
    gender,
    imgUrl,
  });
};

// Log in a user
const login = async (email, password) => {
  return axios.post(API_URL + 'login',  {
    email,
    password,
  }).then(async (response) => {
    if (response.data.name) {
      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(response.data));

      const activities = [];
      let address;
      let lat;
      let lng;

      // Retrieve recycle bin information for each activity
      await Promise.all(response.data.activities.map(async (activity, index) => {
        address = await RecycleBinService.getBin(activity.recycleBinID);
        lat = address.data.location.lat;
        lng = address.data.location.lng;
        address = await UtilService.fetchAddress(lat, lng);
        activity.address = address;
        activities.push(activity);
      }));
      
      localStorage.setItem('userActivities', JSON.stringify(activities));
    }
    return response.data;
  });
};

// Log out the current user
const logout = () => {
  localStorage.clear();
};

// Get the current logged-in user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Get the activities of the current logged-in user
const getCurrentUserActivities = () => {
  const activities = JSON.parse(localStorage.getItem('userActivities'));
  return activities;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getCurrentUserActivities,
};

export default AuthService;
