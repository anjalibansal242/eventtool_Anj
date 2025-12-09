import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './DoughnutChart2.css';
import { getEmissionDuringEventActivity, useApi } from './apiService';

const DoughnutChart2 = ({ eventId }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [mainData, setMainData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [hasPositiveData, setHasPositiveData] = useState(false);
  const [isDetailChartVisible, setIsDetailChartVisible] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [totalEmission, setTotalEmission] = useState(0);
  const api = useApi();

  const colorPalette = [
    '#007272',
    '#7CC97B', 
    '#3379AB', 
    '#12B6B6', 
    '#48AD7F'  
  ];

  const lightenColor = (color, percent) => {
    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return `#${(
      0x1000000 + 
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1).toUpperCase()}`;
  };

  const hasAnyPositiveValue = (values) => values.some(value => value > 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Pass eventId:', eventId);
        const data = await getEmissionDuringEventActivity(eventId);
        console.log('DuringEventEmission Data:', data); 
        setMainData(data.mainData);
        setDetailedData(data.detailedData);
        setIsDataFetched(true);

        const dataValues = data.mainData.map(item => item.cumulativevalue);
        setHasPositiveData(hasAnyPositiveValue(dataValues));

        const total = dataValues.reduce((acc, value) => acc + value, 0);
        setTotalEmission(total.toFixed(2));

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsDataFetched(true); 
        setHasPositiveData(false); 
      }
    };

    fetchData();
  }, [eventId]);

  useEffect(() => {
    if (!hasPositiveData || mainData.length === 0 || detailedData.length === 0) return;

    const labels = mainData.map(item => item.emissionType);
    const dataValues = mainData.map(item => item.cumulativevalue);

    const data = {
      labels,
      datasets: [{
        label: 'Carbon Emission',
        data: dataValues,
        backgroundColor: colorPalette,
        borderColor: colorPalette,
        borderWidth: 0,
        cutout: '60%',
      }],
    };

    // Updated this part to add "KgCO₂" as suffix directly
    const detailedDatasets = detailedData.map((item, index) => ({
      labels: item.data.map(sub => `${sub.emissionSubcategory}: ${sub.value.toFixed(2)} KgCO₂`),
      data: item.data.map(sub => sub.value),
      backgroundColor: item.data.map((_, idx) => lightenColor(colorPalette[index % colorPalette.length], 30)),
      borderColor: item.data.map((_, idx) => lightenColor(colorPalette[index % colorPalette.length], 10)),
      borderWidth: 1,
    }));

    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                // Add "KgCO₂" suffix and format to two decimal places
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
            display: false,
          },
          datalabels: {
            display: false,
          },
        },
        cutout: '70%',
      },
      plugins: [
        {
          beforeEvent(chart, args) {
            const event = args.event;
            const chartInfo = document.getElementById('chartInfo');
            const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            let infoText = '';

            if (event.type === 'mousemove' && !isDetailChartVisible) {
              if (elements.length) {
                const index = elements[0].index;

                if (index < detailedDatasets.length && chart.data.datasets.length === 1) {
                  const detailedDataset = detailedDatasets[index];
                  chart.data.datasets.push({
                    label: chart.data.labels[index],
                    data: detailedDataset.data,
                    backgroundColor: detailedDataset.backgroundColor,
                    borderColor: detailedDataset.borderColor,
                    borderWidth: detailedDataset.borderWidth,
                  });
                  chart.options.cutout = '30%';
                  chart.update();
                  infoText = `<p class="info-title" style="color: ${chart.data.datasets[0].backgroundColor[index]};">${chart.data.labels[index]}</p><ul class="info-list">`;
                  detailedDataset.labels.forEach((label, i) => {
                    infoText += `<li><span class="color-indicator" style="background-color: ${detailedDataset.backgroundColor[i]};"></span>${label}</li>`;
                  });
                  infoText += '</ul>';
                  chartInfo.innerHTML = infoText;
                }
              } else if (chart.data.datasets.length > 1 && !isDetailChartVisible) {
                chart.data.datasets.pop();
                chart.options.cutout = '70%';
                chart.update();
                chartInfo.innerHTML = ''; // Clear infoText to prevent duplication
              }
            }
          },
          afterEvent(chart, args) {
            const event = args.event;
            const chartInfo = document.getElementById('chartInfo');
            if (event.type === 'click') {
              const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
              if (elements.length) {
                const index = elements[0].index;
                setClickedIndex(index);
                setIsDetailChartVisible(true);

                if (index < detailedDatasets.length) {
                  const detailedDataset = detailedDatasets[index];
                  if (chart.data.datasets.length === 1) {
                    chart.data.datasets.push({
                      label: chart.data.labels[index],
                      data: detailedDataset.data,
                      backgroundColor: detailedDataset.backgroundColor,
                      borderColor: detailedDataset.borderColor,
                      borderWidth: detailedDataset.borderWidth,
                    });
                  } else {
                    chart.data.datasets[1].data = detailedDataset.data;
                    chart.data.datasets[1].backgroundColor = detailedDataset.backgroundColor;
                    chart.data.datasets[1].borderColor = detailedDataset.borderColor;
                    chart.data.datasets[1].borderWidth = detailedDataset.borderWidth;
                  }
                  chart.options.cutout = '20%';
                  chart.update();
                  let infoText = `<p class="info-title" style="color: ${chart.data.datasets[0].backgroundColor[index]};">${chart.data.labels[index]}</p><ul class="info-list">`;
                  detailedDataset.labels.forEach((label, i) => {
                    infoText += `<li><span class="color-indicator" style="background-color: ${detailedDataset.backgroundColor[i]};"></span>${label}</li>`;
                  });
                  infoText += '</ul>';
                  chartInfo.innerHTML = infoText;
                }
              }
            }
          },
        },
        ChartDataLabels,
      ],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [mainData, detailedData, hasPositiveData, isDetailChartVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target)) {
        setIsDetailChartVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const renderLegend = () => {
    return (
      <div className="legend-container">
        {mainData.map((item, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
            ></div>
            {item.emissionType}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="chart-container">
        <div className="chartMenu">
          <p>Emission <br /> <span>During Event Activities</span></p>
          <p>Total: {totalEmission} KgCO₂</p> 
        </div>
        <div className="chartCard">
          <div className="chartBox">
            {!isDataFetched ? (
              <div style={{ textAlign: 'center' }}>
                <br /> <br /> <br /> 
                <h5>Data Awaited</h5>
              </div>
            ) : hasPositiveData ? (
              <canvas ref={canvasRef} id="myChart" />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <br /> <br />  <br /><br /><br /><br /><br /><br /><br />
                <h5>Data Awaited</h5>
              </div>
            )}
          </div>
          <div id="chartInfo" className={`chartInfo ${isDetailChartVisible ? 'visible' : ''}`}></div>
          {hasPositiveData && renderLegend()}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart2;
