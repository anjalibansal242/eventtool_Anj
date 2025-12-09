import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './DoughnutChart.css';
import { getEmissionPreEventActivity } from './apiService';

const DoughnutChart = React.memo(({ eventId }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Carbon Emission',
                data: [],
                backgroundColor: [
                    '#007272',
                    '#7CC97B',
                    '#3379AB',
                    '#12B6B6',
                    '#48AD7F'
                ],
                borderColor: [
                    '#007272',
                    '#7CC97B',
                    '#3379AB',
                    '#12B6B6',
                    '#48AD7F'
                ],
                borderWidth: 0,
                cutout: '60%',
            }
        ]
    });
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [hasPositiveData, setHasPositiveData] = useState(false);
    const [totalEmission, setTotalEmission] = useState(0); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getEmissionPreEventActivity(eventId);
                const mainData = response.mainData || [];
                console.log('Fetched Data:', mainData);

                if (mainData.length > 0 && mainData[0].emissionType && mainData[0].cumulativevalue !== undefined) {
                    const labels = mainData.map(item => item.emissionType);
                    const dataValues = mainData.map(item => item.cumulativevalue);

                    console.log('Labels:', labels);
                    console.log('Data Values for preEventActivities:', dataValues);

                    const positiveData = dataValues.filter(value => value > 0);
                    setHasPositiveData(positiveData.length > 0);

                    // Calculate total emission
                    const total = dataValues.reduce((acc, value) => acc + value, 0);
                    setTotalEmission(total.toFixed(2));

                    setChartData(prevData => ({
                        ...prevData,
                        labels: labels,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: dataValues
                        }]
                    }));
                } else {
                    console.error("Unexpected data structure:", mainData);
                }
                setIsDataFetched(true);
            } catch (error) {
                console.error("Error fetching emission pre-event activity data:", error);
                setIsDataFetched(true);
            }
        };

        fetchData();
    }, [eventId]);

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (context.parsed) {
                            const formattedValue = context.parsed.toFixed(2); // Format value to two decimal places
                            label += `: ${formattedValue} KgCO₂`;
                        }
                        return label;
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 18,
                    color: '#36454F',
                    font: {
                        size: 12,
                    }
                },
                align: 'start',
            }
        }
    };

    return (
        <div className="card">
            <div className="chart-container">
                <p>Emission <br /> <span>Pre Event Activities</span></p>
                <p>Total: {totalEmission} KgCO₂</p> 
                {isDataFetched && hasPositiveData ? (
                    <Doughnut data={chartData} options={options} id="smallDoughnutChart" />
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <br /> <br /> <br /> <br /> <br /> <br /> <br /><br /><br />
                        <h5>Data Awaited</h5>
                    </div>
                )}
            </div>
        </div>
    );
});

export default DoughnutChart;
