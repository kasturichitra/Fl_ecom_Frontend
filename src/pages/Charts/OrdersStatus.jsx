import React from "react";
import CommonPieChart from "./CommonPieChart";
import { useGetOrdersByStatus } from "../../hooks/useDashboard";

const OrdersStatusChart = ({ from, to }) => {
  const { data: orderStatusData, isLoading, isError } = useGetOrdersByStatus({ from, to });
  // console.log(orderStatusData,"orderStatusData");

  if (isLoading) return <p>Loading...</p>;
  if (isError || !orderStatusData) return <p>Error loading order status</p>;

  // Convert object → arrays
  const labels = Object.keys(orderStatusData); // ["pending", "processing", ...]
  const counts = Object.values(orderStatusData).map((i) => i.count);
  const values = Object.values(orderStatusData).map((i) => i.value);

  // console.log("labels", labels);
  // console.log("counts", counts);
  // console.log("values", values);

  // Prepare stats for tooltip if needed
  const stats = labels.map((label, i) => ({
    count: counts[i],
    totalAmount: values[i],
    percentage: counts.reduce((a, b) => a + b, 0)
      ? ((counts[i] / counts.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      : 0,
  }));

  const colors = ["#a78bfa", "#60a5fa", "#93c5fd", "#6ee7b7", "#f87171", "#fb923c"];

  return (
    <CommonPieChart title="Orders Status Overview" labels={labels} counts={counts} stats={stats} colors={colors} />
  );
};

export default OrdersStatusChart;
