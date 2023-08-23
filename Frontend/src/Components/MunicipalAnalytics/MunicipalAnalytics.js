import React from 'react';
import AnalyticsGraph from '../AnalyticsGraph/AnalyticsGraph';
import './MunicipalAnalytics.css';

export default function Analytics(props) {
    // Function to render each analytics item
    function eachItem(item, i) {
        const uniqueUsers = new Set();

        // Filter the recycler users based on their activities in the current recycle bin
        const binUsers = props.users.filter(user =>
            user.activities.some(activity => {
                return activity.recycleBinID === item._id;
            })
        );

        // Calculate the gender data for the binUsers
        const genderData = binUsers.reduce((acc, curr) => {
            acc[curr.gender] = acc[curr.gender] || { name: curr.gender, value: 0 };
            const activityCount = curr.activities.reduce((count, activity) => {
                if (activity.recycleBinID === item._id && !uniqueUsers.has(curr._id)) {
                    uniqueUsers.add(curr._id);
                    count++;
                }
                return count;
            }, 0);
            acc[curr.gender].value += activityCount;
            return acc;
        }, {});

        const genderChartData = Object.values(genderData);

        // Render the AnalyticsGraph component for each item
        return (
            <AnalyticsGraph
                key={i}
                index={item._id}
                genderChartData={genderChartData}
                ageBottles={false}
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
                {items && items.length > 0 ? items.map(eachItem) : "There's no items to show."}
            </div>
        </div>
    );
}
