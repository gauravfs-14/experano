"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analysis() {
  const demoData = {
    events: [
      {
        id: 1,
        title: "Tech Conference 2024",
        likes: 45,
        views: 120,
        date: "2024-01-15",
      },
      {
        id: 2,
        title: "Networking Mixer",
        likes: 32,
        views: 85,
        date: "2024-01-20",
      },
      {
        id: 3,
        title: "Workshop Series",
        likes: 67,
        views: 150,
        date: "2024-01-25",
      },
    ],
  };

  const chartData = {
    labels: demoData.events.map((event) => event.title),
    datasets: [
      {
        label: "Likes",
        data: demoData.events.map((event) => event.likes),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Views",
        data: demoData.events.map((event) => event.views),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#666",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold Bark:text-gray-800">
            Event Performance Analysis
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 Bark:text-gray-700">
            Event Metrics Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {demoData.events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 border Bark:border-gray-200"
              >
                <h3 className="font-bold Bark:text-gray-800">{event.title}</h3>
                <p className="Bark:text-gray-600">Date: {event.date}</p>
                <div className="mt-2">
                  <p className="Bark:text-gray-700">👍 Likes: {event.likes}</p>
                  <p className="Bark:text-gray-700">👀 Views: {event.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[400px]">
          <h2 className="text-xl font-semibold mb-4 Bark:text-gray-700">
            Performance Comparison
          </h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
