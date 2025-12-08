import React from "react";
import { useGetAllOrders } from "../../hooks/useOrder";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PaymentMethodChart = () => {
  const {
    data: OrdersData,
    isLoading,
    isError,
  } = useGetAllOrders({
    page: 1,
    limit: 1000,
    order_status: "",
    order_type: "",
    payment_method: "",
  });

  if (isLoading)
    return (
      <p className="text-center py-6 text-gray-500 text-sm">
        Loading payments...
      </p>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 font-medium text-sm">
        Error loading payment methods
      </p>
    );

  const orders = OrdersData?.data || [];

  // PAYMENT METHODS (final corrected list)
  const labels = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Net Banking",
    "UPI",
    "Wallet",
  ];

  const paymentStats = labels.map((method) => {
    const filtered = orders.filter((o) => o?.payment_method === method);
    const count = filtered.length;
    const totalAmount = filtered.reduce(
      (sum, o) => sum + parseFloat(o?.total_amount || o?.amount || 0),
      0
    );

    return { count, totalAmount: totalAmount.toFixed(2) };
  });

  const counts = paymentStats.map((s) => s.count);

  // 6 soft modern colors
const classicColors = [
  "#4F46E5", // Cash – Indigo
  "#06B6D4", // Credit Card – Teal
  "#10B981", // Debit Card – Emerald
  "#F59E0B", // Net Banking – Amber
  "#EC4899", // UPI – Pink
  "#8B5CF6", // Wallet – Violet
];
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
            const { count, totalAmount } = paymentStats[i];
            const perc = orders.length
              ? ((count / orders.length) * 100).toFixed(1)
              : 0;

            return [
              `Orders : ${count}`,
              `Value : ${toIndianCurrency(totalAmount)}`,
              `Share : ${perc}%`,
            ];
          },
        },
      },
      datalabels: {
        display: false, // same as your previous component
      },
    },
  };

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Orders by Payment Method
        </h1>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md h-96 flex items-center justify-center">
            <Pie data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodChart;
