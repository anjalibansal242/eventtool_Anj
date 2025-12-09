import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const MealConsumptionDoughnutChart = ({ attendeeMealConsumptions }) => {
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
        ],
      },
    ],
  });

  const mealMapping = {
    6: 'Veg',
    7: 'Non-Veg',
    8: 'Vegan',
  };

  useEffect(() => {
    if (attendeeMealConsumptions && attendeeMealConsumptions.length > 0) {
      const mealData = {};

      attendeeMealConsumptions.forEach((consumption) => {
        const mealType = mealMapping[consumption.mealId] || `Meal ${consumption.mealId}`;
        if (!mealData[mealType]) {
          mealData[mealType] = 0;
        }
        mealData[mealType] += consumption.attendeeCount;
      });

      setChartData({
        labels: Object.keys(mealData),
        datasets: [
          {
            data: Object.values(mealData),
            backgroundColor: [
              '#007272',
              '#7CC97B',
              '#3379AB',
              '#12B6B6',
              '#48AD7F',
            ],
            borderColor: [
              '#007272',
              '#7CC97B',
              '#3379AB',
              '#12B6B6',
              '#48AD7F',
            ],
            borderWidth: 0,
            cutout: '60%',
          },
        ],
      });
    }
  }, [attendeeMealConsumptions]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', height:'800px', marginTop:'80px'}}>
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
                Meal Consumption Distribution
              </span>
            </p>
            
          </div>
        <div style={{ width: '280px', height: '280px' }}>
          <Doughnut data={chartData} />
        </div>
      </div>
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              <th>Meal Type</th>
              <th>Attendee Count</th>
            </tr>
          </thead>
          <tbody>
            {attendeeMealConsumptions && attendeeMealConsumptions.length > 0 ? (
              attendeeMealConsumptions.map((consumption) => {
                const mealType = mealMapping[consumption.mealId] || `Meal ${consumption.mealId}`;
                return (
                  <tr key={consumption.attendeeMealConsumptionId}>
                    <td>{mealType}</td>
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

export default MealConsumptionDoughnutChart;
