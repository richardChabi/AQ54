import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart,registerables } from 'chart.js';
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

Chart.register(...registerables,
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

const AirQualityComponent = () => {
  const [data, setData] = useState(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://airqino-api.magentalab.it/getCurrentValues/SMART188');
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
      const ctx = document.getElementById('chart2');
      const newChart = new Chart(ctx, {
        type: 'bar',
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
          barPercentage: 0.3,
        },
      });
      chartInstanceRef.current = newChart;
    }
  }, [data]);

  const formatChartData = () => {
    if (!data) {
        return null; // Retournez null si les données ne sont pas disponibles
    }

    const labels = data.values.map(entry => entry.sensor);
    const values = data.values.map(entry => entry.value);

    // Fonction pour générer des couleurs aléatoires
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Générer un tableau de couleurs pour chaque élément
    const backgroundColors = Array.from({ length: labels.length }, () => getRandomColor());
    const borderColors = backgroundColors.map(color => `${color}1`); // Ajouter de l'opacité à la bordure

    return {
        labels: labels,
        datasets: [
            {
                label: 'Air Quality Data',
                data: values,
                fill: false,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };
};


  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <h1>Air Quality Data</h1>
      {data ? (
        <div>
          <canvas id="chart2" width="400" height="200"></canvas>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};


export default AirQualityComponent;
