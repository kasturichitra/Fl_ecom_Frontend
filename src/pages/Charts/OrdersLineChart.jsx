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
import { useGetAllOrders } from "../../hooks/useOrder";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrdersLineChart = () => {
  const { data: OrdersData, isLoading, isError } = useGetAllOrders({
    page: 1,
    limit: 1000,
    order_status: "",
    order_type: "",
    payment_method: "",
  });

  if (isLoading)
    return <p className="text-center py-6 text-gray-500">Loading orders...</p>;
  if (isError)
    return <p className="text-center py-6 text-red-600">Error loading orders</p>;

  const orders = OrdersData?.data || [];

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

  // ===== Commented: real orders dataset =====
  // const ordersByMonth = months.map((month, index) =>
  //   orders.filter((o) => {
  //     const date = new Date(o.created_at);
  //     return date.getMonth() === index;
  //   }).length
  // );

  // ===== Using random dataset for now =====
  const ordersByMonth = months.map(() =>
    Math.floor(Math.random() * 100 + 100) // random between 10-109
  );

  const data = {
    labels: months,
    datasets: [
      {
        label: "Number of Orders",
        data: ordersByMonth,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Orders Over Months" },
      tooltip: {
        callbacks: {
          label: (ctx) => `Orders: ${ctx.parsed.y}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Orders Trend</h2>
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default OrdersLineChart;
