import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import './DoughnutChart.css';
import { getIndividualEmission } from "./apiService";

const AttendeePieChart = ({ eventId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIndividualEmission(eventId);
        console.log("AttendeePieChart Data:", response);
        const mainData = response.mainData;

        // Check if mainData is empty
        if (mainData.length > 0) {
          const values = mainData.map((item) => item.value);
          setData(values);
        } else {
          setData([]); // Set to empty array if no data is available
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const chartData = {
    labels: ["Meal", "Travel", "Accommodation"],
    datasets: [
      {
        data: data,
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw.toFixed(2);
            return `${label}: ${value} KgCO₂`;
          },
        },
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  if (data.length === 0) {
    return (
      
          <div className="card">
            <div className="chart-container" style={{ textAlign: "center" }}>
              <p>No emissions data available for attending events.</p>
              <p>Please check back later.</p>
            </div>
          </div>
     
    );
  }

  return (
   
        <div className="card">
          <div className="chart-container">
            <p>Emissions from Attending Events</p>
            <Pie data={chartData} options={options} />
          </div>
        </div>
    
  );
};

export default AttendeePieChart;
