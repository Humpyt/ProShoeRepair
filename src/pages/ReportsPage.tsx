import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileInvoiceDollar, faUserCheck, faChartPie, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { Tooltip as ChartTooltip } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const salesData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
};

const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: $${context.raw}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function ReportsPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const reports = [
    { label: 'Sales Report', icon: faChartLine, color: '#4CAF50' },
    { label: 'Financial Report', icon: faFileInvoiceDollar, color: '#2196F3' },
    { label: 'Customer Report', icon: faUserCheck, color: '#FF5722' },
    { label: 'Inventory Report', icon: faChartPie, color: '#9C27B0' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports Dashboard</h1>
            <p className="text-gray-400">Insights and analytics at a glance</p>
          </div>
          <div className="bg-gray-800 px-8 py-4 rounded-2xl border border-gray-700 shadow-lg backdrop-blur-sm bg-opacity-50">
            <span className="font-mono text-indigo-400 text-3xl digital-clock tracking-wider">
              {new Date().toLocaleTimeString()}
            </span>
            <div className="text-gray-500 text-sm text-center mt-1">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg hover:border-indigo-500 transition-all duration-300 group backdrop-blur-sm bg-opacity-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{report.label}</p>
                  <h3 className="text-3xl font-bold text-white">Details</h3>
                </div>
                <div 
                  className="bg-opacity-20 rounded-xl p-3 group-hover:scale-110 transition-transform flex items-center justify-center" 
                  style={{ backgroundColor: report.color }}
                >
                  <FontAwesomeIcon icon={report.icon} className="text-2xl text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Line data={salesData} options={options} />
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all">Export <FontAwesomeIcon icon={faDownload} className="ml-2" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}