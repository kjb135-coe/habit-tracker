import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Replace with your week labels
  datasets: [
    {
      label: 'Score',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderColor: 'rgba(255, 255, 255, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(255, 255, 255, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81], // Replace with your score data
    },
  ],
};

const options = {
  scales: {
    x: {
      ticks: {
        color: 'white',
      },
    },
    y: {
      ticks: {
        color: 'white',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'white',
      },
    },
  },
};

class LineChart extends Component {
  render() {
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Line data={chartData} options={options} />
      </div>
    );
  }
}

export default LineChart;
