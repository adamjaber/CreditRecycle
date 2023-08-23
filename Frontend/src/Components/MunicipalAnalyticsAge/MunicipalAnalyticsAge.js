
import React from 'react';
import AnalyticsGraph from '../AnalyticsGraph/AnalyticsGraph'
import './MunicipalAnalyticsAge.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function MunicipalAnalyticsAge(props) {
    function eachItem(item, i) {
      // Set to keep track of unique bins
      new Set();
      const ageData = {
        plastic: { name: 'plastic', value: 0 },
        can: { name: 'can', value: 0 },
        glass: { name: 'glass', value: 0 }
      };
      
      // Object to count the number of times a user has recycled a specific item in the current bin
      const userCount = {};
      props.users.forEach(user => {
        user.activities.forEach(activity => {
          if (activity.recycleBinID === item._id) {
            const userId = user._id;
            if (!userCount[userId]) {
              userCount[userId] = { countCan: 0, countGlass: 0, countPlastic: 0 };
            }
            const { countCan, countGlass, countPlastic } = userCount[userId];
            if (activity.items[0].quantity > 0 && countPlastic === 0) {
              ageData.plastic.value += user.age;
              userCount[userId].countPlastic = 1;
            }
            if (activity.items[1].quantity > 0 && countCan === 0) {
              ageData.can.value += user.age;
              userCount[userId].countCan = 1;
            }
            if (activity.items[2].quantity > 0 && countGlass === 0) {
              ageData.glass.value += user.age;
              userCount[userId].countGlass = 1;
            }
          }
        });
      });
    
      // Calculate the total number of users for each item
      const totalPlastic = ageData.plastic.value > 0 ? Object.values(userCount).reduce((acc, curr) => acc + curr.countPlastic, 0) : 0;
      const totalCan = ageData.can.value > 0 ? Object.values(userCount).reduce((acc, curr) => acc + curr.countCan, 0) : 0;
      const totalGlass = ageData.glass.value > 0 ? Object.values(userCount).reduce((acc, curr) => acc + curr.countGlass, 0) : 0;
      
      // Calculate the average age for each item
      ageData.plastic.value = totalPlastic > 0 ? Math.round(ageData.plastic.value / totalPlastic) : 0;
      ageData.can.value = totalCan > 0 ? Math.round(ageData.can.value / totalCan) : 0;
      ageData.glass.value = totalGlass > 0 ? Math.round(ageData.glass.value / totalGlass) : 0;
      // Create an array of gender data for the current item
      const genderChartData = Object.values(ageData);
    
      return (
        <AnalyticsGraph
          key={i}
          index={item._id}
          genderChartData={genderChartData}
          ageBottles={true}
          {...item}
          customId={item.customId}
          className="analytics-item"
        />
      );
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
