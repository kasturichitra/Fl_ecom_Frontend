import { useState } from "react";
import { useGetUsersTrend } from "../../hooks/useDashboard";
import { MONTHS } from "../../lib/constants";
import ReusableLineChart from "./ReusableLineChart";

const UsersTrendChart = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const { data: usersData, isLoading, isError } = useGetUsersTrend({ year: selectedYear });

  // Generate random data for Users (using random dataset for now)
  // TODO: Once API supports user trends, replace this with real data
  const defaultUsersByMonth = MONTHS.map(() => Math.floor(Math.random() * 50 + 10));

  const usersByMonth = usersData?.map((user) => user.count) || defaultUsersByMonth;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header with Title and Year Selector */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-center flex-1">Users Trend</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-96">
        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : isError ? (
          <p className="text-center py-6 text-red-600">Error loading data</p>
        ) : (
          <ReusableLineChart
            labels={MONTHS}
            dataValues={usersByMonth}
            datasetLabel="Number of Users"
            borderColor="rgb(153, 102, 255)"
            backgroundColor="rgba(153, 102, 255, 0.5)"
            chartTitle="Users Over Months"
            cardTitle=""
            tooltipLabel="Users"
            isLoading={false}
            isError={false}
          />
        )}
      </div>
    </div>
  );
};

export default UsersTrendChart;
