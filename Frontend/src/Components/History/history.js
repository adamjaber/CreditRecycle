import React, { useState, useEffect } from 'react';
import './history.css';
import HistoryItem from '../HistoryItem/historyitem'
import AuthService from '../../Services/auth.service';

function History(props) {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Get the current user and their activities when the component mounts
    setUser(AuthService.getCurrentUser());
    setActivities(AuthService.getCurrentUserActivities());
  }, [])

  const eachActivity = () => {
    return user ? activities.map((activity) => (
      <React.Fragment key={activity.id}>
        <div className='hr-line' />
        <HistoryItem date={activity.dateTime} points={activity.points} address={activity.address} />
      </React.Fragment>
    )) : null;
  }
  
  return (
    <div className='history'>
      <img src={require('../../Images/history-background.png')} alt='history-background' />
      {eachActivity()}
    </div>
  );
}

export default History;
