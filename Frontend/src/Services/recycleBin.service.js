import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'https://credit-recycle.com:7000/api/recycleBins/';
const API_URL_OPERATION = 'https://j7b02e0m.ngrok.io/api/recycleBins/';

// Get all recycle bins
const getBins = () => {
    return axios.get(API_URL, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
    });
};

// Get a specific recycle bin by ID
const getBin = (id) => {
    return axios.get(API_URL + id, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
    });
};

// Add a new recycle bin
const addBin = (lat, lng, maxCapacity, status='active') => {
    return axios.post(API_URL, {
        location: {
            lat,
            lng,
        },
        maxCapacity,
        capacity: {
            "plastic" : 0,
            "can" : 0,
            "glass" : 0
        },
        status
    }, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
    });
};

// Delete a recycle bin by ID
const deleteBin = (id) => {
    return axios.delete(API_URL + id, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
    });
};

// Update a recycle bin by ID
const updateBin = (id, lat, lng, maxCapacity, plasticCapacity, canCapacity, glassCapacity, status) => {
    return axios.patch(API_URL + id, {
        location: {
            lat,
            lng,
        },
        maxCapacity,
        capacity: {
            "plastic" : plasticCapacity,
            "can" : canCapacity,
            "glass" : glassCapacity
        },
        status
    }, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}` }
    });
};

// Start recycle operation for a specific bin
const startRecycle = (binApi) => {
    return axios.get(API_URL_OPERATION + 'start' + binApi, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}`, "ngrok-skip-browser-warning":"any" }
    });
};

// Stop recycle operation for a specific bin
const stopRecycle = (binApi) => {
    return axios.get(API_URL_OPERATION + 'stop' + binApi, {
        headers: { "x-access-token": `${AuthService.getCurrentUser().accessToken}`, "ngrok-skip-browser-warning":"any" }
    });
};

const RecycleBinService = {
    getBins,
    getBin,
    addBin,
    deleteBin,
    updateBin,
    startRecycle,
    stopRecycle,
};
export default RecycleBinService;
