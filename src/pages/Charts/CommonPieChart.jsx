import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DropdownFilter } from "../../components/DropdownFilter";
import SearchDropdown from "../../components/SearchDropdown";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CommonPieChart = ({ title, labels, counts, stats, colors, activeTab, data, setSearch, search }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
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
      labels: {
        padding: 5,
        font: { size: 14 },
        generateLabels: (chart) => {
          const data = chart.data;
          const counts = data.datasets[0].data;

          return data.labels.map((label, index) => ({
            text: `${label} - (${counts[index]})`, // ← Append count here
            fillStyle: data.datasets[0].backgroundColor[index],
            strokeStyle: data.datasets[0].backgroundColor[index],
            lineWidth: 2,
            hidden: isNaN(counts[index]),
            index,
          }));
        },
      },
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
          const { count, totalAmount, percentage } = stats[i];

          return [
            `Orders: ${count}`,
            `Value: ${totalAmount}`,
            `Share: ${percentage}%`,
          ];
        },
      },
    },

    datalabels: { display: false },
  },
};



  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className={`text-2xl font-bold text-gray-800 text-center mb-6 ${activeTab === "performance" ? "flex items-center justify-between" : ""}`}>
        {title}
      </h1>
      {activeTab === "performance" && <SearchDropdown value={search} onChange={(value) => {
        setSearch(value)
        setShowDropdown(true)
      }} results={showDropdown ? data : []} onSelect={(value) => {
        setSearch(value)
        setShowDropdown(false)
      }} />}

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md h-96 flex items-center justify-center">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default CommonPieChart;
