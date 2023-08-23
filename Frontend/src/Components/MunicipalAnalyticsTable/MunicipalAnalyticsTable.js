import React from 'react';
import { useState, useEffect } from "react";
import classes from './MunicipalAnalyticsTable.module.css'

function MunicipalTable(props) {
  const [bins, setBins] = useState([]);

  const initArrays = () => {
    let bins = props.bins;
    let users = props.users;

    // Initialize total counts for each bin
    bins.forEach(bin => {
      bin.totalBottles = 0;
      bin.totalPlastic = 0;
      bin.totalCan = 0;
      bin.totalGlass = 0;
    });

    // Calculate total counts for each bin based on user activities
    users.forEach(user => {
      user.activities.forEach(activity => {
        bins.forEach(bin => {
          if (activity.recycleBinID === bin._id) {
            bin.totalBottles += activity.totalBottles;
            bin.totalPlastic += activity.items[0].quantity;
            bin.totalCan += activity.items[1].quantity;
            bin.totalGlass += activity.items[2].quantity;
          }
        });
      });
    });

    // Sort the bins based on totalBottles in descending order
    bins.sort((bin1, bin2) => {
      if (bin1.totalBottles < bin2.totalBottles) {
        return 1;
      } else if (bin1.totalBottles > bin2.totalBottles) {
        return -1;
      } else {
        return 0;
      }
    });

    setBins(bins);
  }

  useEffect(() => {
    if (props.bins.length > 0 && props.users.length > 0) {
      initArrays();
    }
  }, [props.bins, props.users]);

  return (
    <div className={classes.wrapper}>
      {props.bins.length > 0 ? (
        <table className={classes.table}>
          <thead>
            <tr className={classes.tr}>
              <th className={classes.th}>Index</th>
              <th className={classes.th}>Address</th>
              <th className={classes.th}>Plastic</th>
              <th className={classes.th}>Can</th>
              <th className={classes.th}>Glass</th>
              <th className={classes.th}>Total Bottles</th>
              <th className={classes.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin, index) => (
              <tr key={index} className={classes.tr}>
                <td className={classes.td}>{index}</td>
                <td className={classes.td}>{bin.city}</td>
                <td className={classes.td}>{bin.totalPlastic}</td>
                <td className={classes.td}>{bin.totalCan}</td>
                <td className={classes.td}>{bin.totalGlass}</td>
                <td className={classes.td}>{bin.totalBottles}</td>
                <td className={classes.td}>{bin.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>There's no items to show.</p>
      )}
    </div>
  );
}

export default MunicipalTable;
