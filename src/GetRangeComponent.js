// Importez les modules nécessaires de Chart.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
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
} from 'chart.js';

// Enregistrez les modules nécessaires de Chart.js
Chart.register(
  ...registerables,
  BarController,
  LineController,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  PointElement,
  LineElement
);

window.Chart = Chart;

const GetRangeComponent = () => {
  const [data, setData] = useState(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://airqino-api.magentalab.it/getRange/SMART188/2024-01-01/2024-01-01');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Mettre en place une mise à jour périodique toutes les 5 secondes (par exemple)
    const intervalId = setInterval(fetchData, 1000);
    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Détruire le graphique existant lors de la mise à jour des données
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Créer un nouveau graphique si les données sont disponibles
    if (data) {
      const ctx = document.getElementById('chart3');
      const newChart = new Chart(ctx, {
        type: 'line',
        data: formatChartData(),
        options: {
          //maintainAspectRatio: false, // Permettre au graphique de ne pas maintenir le ratio d'aspect
          responsive: true, // Rendre le graphique responsive
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      chartInstanceRef.current = newChart;
    }
  }, [data]);

  const formatChartData = () => {
    if (!data || !data.raw_data || data.raw_data.length === 0) {
      return null; // Retournez null si les données ne sont pas disponibles
    }

    const labels = data.raw_data.map(entry => entry.utc_timestamp);

    // Utilisez toutes les mesures disponibles
    const datasets = Object.keys(data.raw_data[0]).map(key => {
      return {
        label: key,
        data: data.raw_data.map(entry => entry[key]),
        fill: false,
        backgroundColor: getRandomColor(), // Fonction pour générer des couleurs aléatoires
        borderColor: getRandomColor(),
        borderWidth: 1,
      };
    });

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <h1>Get Range</h1>
      {data ? (
        <div>
          <canvas id="chart3" width="800" height="400"></canvas>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default GetRangeComponent;
