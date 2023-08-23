import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './AnalyticsGraph.css';
import UtilService from '../../Services/util.service';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
export default function AnalyticsGraph(props) {
  // Determine the type of chart data based on the available data
  let type = "Gender";
  if (props.ageBottles) {
    type = "Age";
  }
  // Filter out data entries with a value of 0
  const data = Object.values(props.genderChartData).filter(item => item.value > 0);

  const [address, setAddress] = useState('');

  // Fetches the address based on the provided latitude and longitude
  const getAddress = async (lat, lng) => {
    const result = await UtilService.fetchAddress(lat, lng);
    setAddress(result);
  }

  useEffect(() => {
    getAddress(props.location.lat, props.location.lng);
  }, [props]);

  // Prepare the chart data
  const chartData = data.map((entry, index) => ({
    x: [entry.name],
    y: [entry.value],
    type: 'bar',
    marker: {
      color: COLORS[index % COLORS.length],
      line: {
        width: 1,
        color: '#000000'
      }
    },
    name: entry.name,
    hovertemplate: type === "Age" ? "Age of recyclers %{y}<br><extra></extra>" : "Number of recyclers %{y}<br><extra></extra>",
  }));

  return (
    <div className="chart-container">
      {chartData.length > 0 ? (
        <Plot className="small-chart"
          data={chartData}
          layout={{
            title: address,
            xaxis: {
              title: type,
              automargin: true,
            },
            yaxis: {
              title: 'Recyclers',
              automargin: true,
              rangemode: 'nonnegative',
              autorange: true,
            },
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 100,
              pad: 4
            },
            height: 500,
            showlegend: true,
          }}
        />
      ) : (
        <h3>No data to display for {address}.</h3>
      )}
    </div>
  );
}
