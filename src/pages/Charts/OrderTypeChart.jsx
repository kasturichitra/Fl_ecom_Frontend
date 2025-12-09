import React from "react";
import CommonPieChart from "./CommonPieChart";
import { useGetOrdersByType } from "../../hooks/useDashboard";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

const OrderTypeChart = () => {
  const { data: ordersByTypeData, isLoading, isError } = useGetOrdersByType();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading order types</p>;

  const response = ordersByTypeData || {};

  // Extract labels, counts, and values from response
  const labels = Object.keys(response); // e.g., ["pending", "processing", "completed"]
  const counts = Object.values(response).map((i) => i.count);
  const values = Object.values(response).map((i) => i.value);

  // Prepare stats array
  const totalOrders = counts.reduce((a, b) => a + b, 0);
  const stats = labels.map((label, index) => ({
    count: counts[index],
    totalAmount: toIndianCurrency(values[index]),
    percentage: totalOrders ? ((counts[index] / totalOrders) * 100).toFixed(1) : 0,
  }));

  const colors = ["#60a5fa", "#fb923c", "#10b981", "#f59e0b", "#ec4899"]; // Add more if needed

  return (
    <CommonPieChart
      title="Orders by Type"
      labels={labels}
      counts={counts}
      stats={stats}
      colors={colors}
    />
  );
};

export default OrderTypeChart;
