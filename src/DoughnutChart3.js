import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import "./DoughnutChart3.css";
import { getEmissionPostEventActivity } from "./apiService";

const Chart = ({ eventId }) => {
  const [chartData, setChartData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [hasPositiveData, setHasPositiveData] = useState(false);
  const [totalValue, setTotalValue] = useState(0); // Add state for total value

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmissionPostEventActivity(eventId);
        console.log("API Response:", response);

        const apiData = response.mainData.map((item) => {
          let fill;
          switch (item.emissionType) {
            case "Quantity of Paper Waste":
              fill = "#007272";
              break;
            case "Quantity of Organic Waste":
              fill = "#34C759";
              break;
            case "Quantity of Plastic Waste":
              fill = "#12B6B6";
              break;
            default:
              fill = "#000";
          }
          return {
            name: item.emissionType.replace("Quantity of ", ""),
            value: item.cumulativevalue,
            fill,
          };
        });

        console.log("Processed API Data:", apiData);

        const positiveData = apiData.filter((item) => item.value > 0);
        setHasPositiveData(positiveData.length > 0);
        setChartData(positiveData);
        setIsDataFetched(true);

        // Calculate total value
        const total = positiveData.reduce((acc, item) => acc + item.value, 0);
        setTotalValue(total.toFixed(2)); // Format to 2 decimal places
      } catch (error) {
        console.error(
          "Error fetching emission post-event activity data:",
          error
        );
        setChartData([]);
        setHasPositiveData(false);
        setIsDataFetched(true);
        setTotalValue(0); // Set total value to 0 in case of error
      }
    };

    fetchData();
  }, [eventId]);

  const renderLegendText = (value) => (
    <span style={{ color: "#808080", fontWeight: 300, fontSize: "12px" }}>
      {value}
    </span>
  );

  const renderTooltipContent = ({ payload }) => {
    if (payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${name} : ${value.toFixed(2)} KgCO₂`}</p>{" "}
          {/* Format value to 2 decimal places */}
        </div>
      );
    }
    return null;
  };

  console.log("Chart Data:", chartData);

  return (
    <div className="card">
      <div className="chart-container">
        <p>
          Emission <br />{" "}
          <span>
            Post-Event Activities{" "}
            <span className="tooltip-icon">
              <i className="fa fa-info-circle" aria-hidden="true" />
              <span className="tooltip-text">
                The emissions are calculated using standard values for waste
                generation per attendee
              </span>
            </span>
          </span>
        </p>
        <p>Total: {totalValue} KgCO₂</p>
        {isDataFetched && hasPositiveData ? (
          <RadialBarChart
            width={350} // Adjust width as needed
            height={350}
            cx={170}
            cy={125}
            innerRadius={60}
            outerRadius={140}
            barSize={12}
            data={chartData}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 50]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar minAngle={15} background clockWise dataKey="value" />
            <Tooltip content={renderTooltipContent} />
            <Legend
              iconSize={16}
              width={200}
              height={115}
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ lineHeight: "40px" }} // Adjust as needed
              iconType="circle"
              formatter={renderLegendText}
            />
          </RadialBarChart>
        ) : (
          <div style={{ textAlign: "center" }}>
            <br /> <br /> <br /> <br /> <br /> <br /> <br />
            <br />
            <br />
            <h5>Data Awaited</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
