import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ReusableLineChart = ({
  labels,
  dataValues,
  datasetLabel,
  borderColor,
  backgroundColor,
  chartTitle,
  cardTitle,
  tooltipLabel,
  isLoading = false,
  isError = false,
}) => {
  if (isLoading) return <p className="text-center py-6 text-gray-500">Loading...</p>;
  if (isError) return <p className="text-center py-6 text-red-600">Error loading data</p>;

  const data = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: dataValues,
        borderColor,
        backgroundColor,
        tension: 0.3,
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: { display: true, text: chartTitle },
  //     tooltip: {
  //       callbacks: {
  //         label: (ctx) => `${tooltipLabel}: ${ctx.parsed.y}`,
  //       },
  //     },
  //   },
  // };

  const totalOrders = dataValues.reduce((sum, val) => sum + val, 0);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        generateLabels: (chart) => {
          return chart.data.datasets.map((dataset, i) => ({
            text: `${dataset.label} - (Total: ${totalOrders})`,
            fillStyle: dataset.backgroundColor,
            strokeStyle: dataset.borderColor,
            lineWidth: 2,
            hidden: false,
            index: i,
          }));
        },
      },
    },
    title: {
      display: true,
      text: `Orders Overview`,
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${tooltipLabel}: ${ctx.parsed.y}`,
      },
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
};


  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{cardTitle}</h2>
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ReusableLineChart;
