import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import UtilService from '../../Services/util.service';
import './AnalyticsItem.css';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
export default function AnalyticsItem(props) {

  const [address, setAddress] = useState('');

  // Fetches the address based on the provided latitude and longitude
  const getAddress = async (lat, lng) => {
    const result = await UtilService.fetchAddress(lat, lng);
    setAddress(result);
  }

  useEffect(() => {
    getAddress(props.location.lat, props.location.lng);
  }, [props]);

  // Custom tooltip component for displaying additional information on hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${payload[0].name} : ${payload[0].value} recyclers`}</p>
        </div>
      );
    }
    return null;
  };

  // If there is no data to display, show a message
  if (!props.ageData) {
    return <h3>No data to display for {address}.</h3>;
  }

  const data = Object.values(props.ageData);

  // Custom label renderer for the pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      {data.length > 0 ? (
        <div>
          <h3>{address}</h3>

          <PieChart width={420} height={300}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              innerRadius={56}
              outerRadius={92}
              paddingAngle={1}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {/* Generate cells with different colors for each data entry */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>

          <div className="info-container">
            {/* Render information for each data entry */}
            {data.map((entry, index) => (
              <div key={`info-${index}`} className="info-item">
                <div
                  className="color-dot"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                ></div>
                <div className="material-name">{entry.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h3>No data to display for {address}.</h3>
      )}
    </div>
  );
}
