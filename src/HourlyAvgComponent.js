import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Papa from 'papaparse';
import moment from 'moment'; // Importez Moment.js

import {
  BarController,
  LineController,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';

Chart.register(
  require('chartjs-adapter-moment'),
  ...registerables,
  BarController,
  LineController,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  PointElement,
  LineElement,
  TimeScale
);

window.Chart = Chart;

const HourlyAvgComponent = () => {
  const [data, setData] = useState(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const fetchData = async () => {
      try {
        const response = await axios.get('https://airqino-api.magentalab.it/getHourlyAvg/SMART188/2024-01-01/2024-01-01');
        const parsedData = Papa.parse(response.data, { header: true, dynamicTyping: true });
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);

  }, [data]);

  useEffect(() => {
    if (data) {
      const ctx = document.getElementById('chart1');
      const newChart = new Chart(ctx, {
        type: 'line',
        data: formatChartData(),
        options: {
          //maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'YYYY-MM-DD HH:mm',
                },
                parser: 'YYYY-MM-DD HH:mm',
              },
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              stepSize: 10,
            },
          },
          barPercentage: 0.3,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Air Quality Data',
            },
            datalabels: {
              display: true,
              color: ' #05229a ',
            },
          },
        },
        plugins: [ChartDataLabels],
      });
      chartInstanceRef.current = newChart;
    }
  }, [data]);

  const formatChartData = () => {
    if (!data || !data.data || data.data.length === 0) {
      return null;
    }

    const formattedData = data.data.map(entry => ({
      x: moment(entry.bucket_start_timestamp),
      y: entry.raw_value,
    }));

    return {
      datasets: [
        {
          label: 'Air Quality Data',
          data: formattedData,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <h1>Hourly Avg</h1>
      {data ? (
        <div>
          <canvas id="chart1" width="400" height="200"></canvas>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HourlyAvgComponent;
