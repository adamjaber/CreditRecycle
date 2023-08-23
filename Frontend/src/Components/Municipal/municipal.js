import React, { useState, useEffect } from 'react';
import RecycleBinService from '../../Services/recycleBin.service';
import UserService from '../../Services/user.service'
import AuthService from '../../Services/auth.service';
import UtilService from '../../Services/util.service';
import Analytics from '../MunicipalAnalytics/MunicipalAnalytics'
import MunicipalGraph from '../MunicipalAnalyticsGraph/MunicipalAnalyticsGraph'
import MunicipalTable from '../MunicipalAnalyticsTable/MunicipalAnalyticsTable';
import MunicipalAnalyticsAge from '../MunicipalAnalyticsAge/MunicipalAnalyticsAge';
import { useNavigate } from 'react-router-dom';

import './municipal.css';
function Municipal() {
  const [recycleBins, setRecyclebins] = useState([]);
  const [recyclerUsers, setrecyclerUsers] = useState([]);
  const navigate = useNavigate();

  // Function to initialize the arrays of recycle bins and recycler users
  const initArrays = async () => {
    try {
      // Get the current user from the authentication service
      let user_ = await AuthService.getCurrentUser();

      // Get the list of users sorted by wallet from the user service
      let users = (await UserService.getUsers('?sort=wallet')).data;

      
      // Get the list of recycle bins from the recycle bin service
      let bins = (await RecycleBinService.getBins()).data;

      // Get the municipal city from the current user
      const municipalCity = user_.city;

      // Filter the recycle bins based on the municipal city
      const binsInArea = await Promise.all(bins.map(async bin => {
        try {
          let city = await UtilService.fetchAddress(bin.location.lat, bin.location.lng);
          if (municipalCity === city.split(', ')[1]) {
            bin.city = city;
            return bin;
          } else {
            return null;
          }
        } catch (err) {
          console.error('Error:', err);
          return null;
        }
      }));

      // Remove any null values from the filtered array
      const filteredBins = binsInArea.filter(bin => bin !== null);

      // Set the recycle bins and recycler users in the state
      setRecyclebins(filteredBins);
      setrecyclerUsers(users);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // Check if the current user is a municipal user
    let currentUser = AuthService.getCurrentUser();
    if (!currentUser.userType.municipal) {
      navigate('/');
    }

    // Initialize the arrays of recycle bins and recycler users
    initArrays();
  }, []);

  return (
    <div className='wrapper'>
      <MunicipalTable bins={recycleBins} users={recyclerUsers} />
      <div className='flexwrapper'>
        <MunicipalAnalyticsAge bins={recycleBins} users={recyclerUsers} />
        <Analytics users={recyclerUsers} bins={recycleBins} />
        <MunicipalGraph users={recyclerUsers} bins={recycleBins} />
      </div>
    </div>
  );
}
export default Municipal;
