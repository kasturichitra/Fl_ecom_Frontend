import React from "react";
import { useGetAllOrders } from "../../hooks/useOrder";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Orders = () => {
  const {
    data: OrdersData,
    isLoading,
    isError,
  } = useGetAllOrders({
    page: 1,
    limit: 20,
    order_status: "",
    order_type: "",
    payment_method: "",
  });

  if (isLoading) return <p className="text-center py-6 text-gray-500 text-sm">Loading orders...</p>;

  if (isError) return <p className="text-center text-red-600 font-medium text-sm">Error loading orders</p>;

  const orders = OrdersData?.data || [];

  // console.log("orders", orders);

  const labels = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  const statusStats = labels.map((status) => {
    const filtered = orders.filter((o) => o?.order_status === status);
    const count = filtered.length;
    const totalAmount = filtered.reduce((sum, o) => sum + parseFloat(o?.total_amount || o?.amount || 0), 0);
    return { count, totalAmount: totalAmount.toFixed(2) };
  });

  const counts = statusStats.map((s) => s.count);

  const classicColors = ["#a78bfa", "#60a5fa", "#93c5fd", "#6ee7b7", "#f87171", "#fb923c"];

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: classicColors,
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 5, font: { size: 14 } },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        cornerRadius: 8,
        padding: 10,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          title: (ctx) => ctx[0].label,
          label: (ctx) => {
            const i = ctx.dataIndex;
            const { count, totalAmount } = statusStats[i];
            const perc = orders.length ? ((count / orders.length) * 100).toFixed(1) : 0;
            return [`Orders : ${count}`, `Value : ${toIndianCurrency(totalAmount)}`, `Share : ${perc}%`];
          },
        },
      },
      // This completely removes all labels from pie slices
      datalabels: {
        display: false,  // Only this line changed
      },
    },
  };

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Orders Status Overview</h1>

        {/* CENTER PIE CHART */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md h-96 flex items-center justify-center">
            <Pie data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;