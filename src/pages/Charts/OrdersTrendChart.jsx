import { useState } from "react";
import { useGetOrdersTrend } from "../../hooks/useDashboard";
import { MONTHS } from "../../lib/constants";
import ReusableLineChart from "./ReusableLineChart";

const OrdersTrendChart = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const { data: ordersData, isLoading, isError } = useGetOrdersTrend({ year: selectedYear });

  // Generate random data for fallback
  const defaultOrdersByMonth = MONTHS.map(() => Math.floor(Math.random() * 100 + 100));

  const ordersByMonth = ordersData?.map((order) => order.count) || defaultOrdersByMonth;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header with Title and Year Selector */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-center flex-1">Orders Trend</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Chart */}
      <div className="">
        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center py-6 text-red-600">Error loading data</p>
        ) : (
          <ReusableLineChart
            labels={MONTHS}
            dataValues={ordersByMonth}
            datasetLabel="Number of Orders"
            borderColor="rgb(75, 192, 192)"
            backgroundColor="rgba(75, 192, 192, 0.5)"
            chartTitle="Orders Over Months"
            cardTitle=""
            tooltipLabel="Orders"
            isLoading={false}
            isError={false}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersTrendChart;
