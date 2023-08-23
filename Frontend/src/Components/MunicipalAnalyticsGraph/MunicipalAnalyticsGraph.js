import React from 'react';
import AnalyticsItem from '../AnalyticsItem/AnalyticsItem';
import './MunicipalAnalyticsGraph.css';

export default function MunicipalGraph(props) {
  function eachItem(item, i) {
    const binUsers = props.users.filter(user => user.activities.some(activity => activity.recycleBinID === item._id))
    const uniqueUsers = new Set(); // Create a Set to keep track of unique users
    const ageData = binUsers.reduce((acc, curr) => {
      const ageGroup = Math.floor(curr.age / 10) * 10;
      acc[ageGroup] = acc[ageGroup] || { name: `${ageGroup}-${ageGroup + 9}`, value: 0 };

      const activityCount = curr.activities.reduce((count, activity) => {
        if (activity.recycleBinID === item._id && !uniqueUsers.has(curr._id)) {
          uniqueUsers.add(curr._id); // Add the user to the Set if they haven't been counted yet 
          count++;
        }
        return count;
      }, 0);

      acc[ageGroup].value += activityCount;
      return acc;
    }, {});

    return <AnalyticsItem key={i} index={item._id} ageData={ageData}
      {...item} customId={item.customId} className="analytics-item" />
  }

  let items = props.bins;
  return (
    <div className='list'>
      <div className='wrapper analytics-container'>
        {(items && items.length > 0) ? items.map(eachItem) : "There's no items to show."}
      </div>
    </div>
  )
}
