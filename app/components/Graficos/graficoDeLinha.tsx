import {  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: number[];
  labels: string[];
  title: string;
}

const LineChart = ({ data, labels, title }: LineChartProps) => {
  const chartData = {
    labels,
    datasets: [{
      label: title,
      data,
      borderColor: '#475569',
      backgroundColor: 'rgba(71, 85, 105, 0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#475569',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#334155',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#475569',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#E2E8F0',
          drawBorder: false,
        },
        ticks: {
          color: '#64748B',
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: { size: 12 }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart; 