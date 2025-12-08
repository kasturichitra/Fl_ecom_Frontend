import React from "react";
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
import { useGetAllUsers } from "../../hooks/useUser"; // adjust path if needed

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UsersLineChart = () => {
  const { data: UsersData, isLoading, isError } = useGetAllUsers({
    searchTerm: "",
    sort: "",
    page: 1,
    limit: 1000,
    role: "",
  });

  if (isLoading)
    return <p className="text-center py-6 text-gray-500">Loading users...</p>;
  if (isError)
    return <p className="text-center py-6 text-red-600">Error loading users</p>;

  const users = UsersData || [];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ===== Commented: real users dataset =====
  // const usersByMonth = months.map((month, index) =>
  //   users.filter((u) => {
  //     const date = new Date(u.created_at);
  //     return date.getMonth() === index;
  //   }).length
  // );

  // ===== Using random dataset for now =====
  const usersByMonth = months.map(() =>
    Math.floor(Math.random() * 50 + 10) // random between 10-59
  );

  const data = {
    labels: months,
    datasets: [
      {
        label: "Number of Users",
        data: usersByMonth,
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Users Over Months" },
      tooltip: {
        callbacks: {
          label: (ctx) => `Users: ${ctx.parsed.y}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Users Trend</h2>
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default UsersLineChart;
