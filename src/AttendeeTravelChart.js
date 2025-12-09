import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const TravelModeDoughnutChart = ({ attendeeTravelConsumptions }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      },
    ],
  });

  const travelModeMappings = {
    1: 'Car - Diesel',
    2: 'Car - Petrol',
    3: 'Car - CNG',
    4: 'Car - Electric',
    5: 'Bus - Fuel-Based',
    6: 'Train',
    7: 'Bus - Electric',
    8: 'Flight - Economy',
    13: 'Flight - Business',
  };

  useEffect(() => {
    if (attendeeTravelConsumptions && attendeeTravelConsumptions.length > 0) {
      const travelModeData = {};

      attendeeTravelConsumptions.forEach((consumption) => {
        const mode = travelModeMappings[consumption.travelModeId];
        if (mode) {
          if (!travelModeData[mode]) {
            travelModeData[mode] = 0;
          }
          travelModeData[mode] += consumption.attendeeCount;
        }
      });

      setChartData({
        labels: Object.keys(travelModeData),
        datasets: [
          {
            data: Object.values(travelModeData),
            backgroundColor: [
              '#007272',
              '#7CC97B',
              '#3379AB',
              '#12B6B6',
              '#48AD7F',
              '#A9DFBF',
              '#2E8B57',
              '#3CB371',
              '#228B22',
              '#6B8E23'
            ],
            borderColor: [
              '#007272',
              '#7CC97B',
              '#3379AB',
              '#12B6B6',
              '#48AD7F',
              '#A9DFBF',
              '#2E8B57',
              '#3CB371',
              '#228B22',
              '#6B8E23'
            ],
            borderWidth: 0,
            cutout: '60%',
          },
        ],
      });
    }
  }, [attendeeTravelConsumptions]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
              marginBottom: '20px',
              fontSize: '18px',
              color: '#333',
              fontWeight: '600',  
              textAlign: 'center'
          }}>
            <p>
              Emission <br /> 
              <span style={{ marginBottom: '20px',fontSize: '18px' ,fontWeight: '600' }}>
                Travel Mode Distribution
              </span>
            </p>
            
          </div>
        <div style={{ width: '350px', height: '350px' }}>
          <Doughnut data={chartData} />
        </div>
      </div>
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', tableLayout:'fixed' }}>
          <thead>
            <tr>
              <th>Travel Mode</th>
              <th>Attendee Count</th>
            </tr>
          </thead>
          <tbody>
            {attendeeTravelConsumptions && attendeeTravelConsumptions.length > 0 ? (
              attendeeTravelConsumptions.map((consumption) => {
                const mode = travelModeMappings[consumption.travelModeId] || "Unknown";
                return (
                  <tr key={consumption.attendeeTravelConsumptionId}>
                    <td>{mode}</td>
                    <td>{consumption.attendeeCount}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelModeDoughnutChart;
