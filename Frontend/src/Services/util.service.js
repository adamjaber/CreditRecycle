const GEOCODE_API_KEY = '4a1b0859ad9f450098e3a1e6d3da97dd';

// Fetch the address based on latitude and longitude
const fetchAddress = async (lat, lng) => {
  const requestOptions = {
    method: 'GET',
  };
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOCODE_API_KEY}`, requestOptions);
    const result = (await response.json()).features[0].properties;
    return `${result.address_line1}, ${result.city}`;
  } catch (error) {
    console.log('error', error);
  }
  return '';
};

// Fetch the coordinates (latitude and longitude) based on the city name
const fetchCoordinates = async (city) => {
  const requestOptions = {
    method: 'GET',
  };
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?city=${city}&format=json&apiKey=${GEOCODE_API_KEY}`, requestOptions);
    const result = await response.json();
    return `${result.results[0].lat},${result.results[0].lon}`;
  } catch (error) {
    console.log('error', error);
  }
  return '';
};

const UtilService = {
  fetchAddress,
  fetchCoordinates
};

export default UtilService;
