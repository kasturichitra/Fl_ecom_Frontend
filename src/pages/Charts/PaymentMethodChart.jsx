import React from "react";
import CommonPieChart from "./CommonPieChart";
import { useGetOrdersByPaymentMethod } from "../../hooks/useDashboard";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

const PaymentMethodChart = () => {
  const {
    data: ordersByPaymentMethodData,
    isLoading,
    isError,
  } = useGetOrdersByPaymentMethod();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading payments</p>;

  const response = ordersByPaymentMethodData || {};

  // Extract labels, counts, and total values from response
  const labels = Object.keys(response);
  const counts = Object.values(response).map((i) => i.count);
  const values = Object.values(response).map((i) => i.value);

  // console.log("labels", labels);
  // console.log("counts", counts);
  // console.log("values", values);

  // Prepare stats array
  const stats = labels.map((label, index) => ({
    count: counts[index],
    totalAmount: toIndianCurrency(values[index]),
    percentage: counts.reduce((a, b) => a + b, 0)
      ? ((counts[index] / counts.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      : 0,
  }));

  const colors = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];

  return (
    <CommonPieChart
      title="Orders by Payment Method"
      labels={labels}
      counts={counts}
      stats={stats}
      colors={colors}
    />
  );
};

export default PaymentMethodChart;
