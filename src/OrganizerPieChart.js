import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

import { getOrganizerEmission } from "./apiService";

const OrganizerPieChart = ({ eventId }) => {
  const [data, setData] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrganizerEmission(eventId);
        console.log("OrganizerPieChart Data:", response);
        const mainData = response.mainData;

        const totals = mainData.reduce(
          (acc, item) => {
            if (item.emissionType === "Travel") {
              acc.travel += item.value;
            } else if (item.emissionType === "Accommodation") {
              acc.accommodation += item.value;
            }
            return acc;
          },
          { travel: 0, accommodation: 0 }
        );

        setData([totals.travel, totals.accommodation]);
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
    labels: ["Travel", "Accommodation"],
    datasets: [
      {
        data: data,
        backgroundColor: ["#FF6384", "#FFCE56"],
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

  return (
   
        <div className="card">
          <div className="chart-container">
            <p>Emissions from Meeting Activities</p>
            <Pie data={chartData} options={options} />
          </div>
        </div>
     
  );
};

export default OrganizerPieChart;
