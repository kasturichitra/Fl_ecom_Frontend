import React from "react";
import CommonPieChart from "./CommonPieChart";
import { useGetAllOrders } from "../../hooks/useOrder";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

const PaymentMethodChart = () => {
  const { data: OrdersData, isLoading, isError } = useGetAllOrders({
    page: 1,
    limit: 1000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading payments</p>;

  const orders = OrdersData?.data || [];

  const labels = ["Cash", "Credit Card", "Debit Card", "Net Banking", "UPI", "Wallet"];

  const stats = labels.map((method) => {
    const filtered = orders.filter((o) => o?.payment_method === method);
    const count = filtered.length;
    const total = filtered.reduce((sum, o) => sum + (o?.total_amount || 0), 0);

    return {
      count,
      totalAmount: toIndianCurrency(total),
      percentage: orders.length ? ((count / orders.length) * 100).toFixed(1) : 0,
    };
  });

  const counts = stats.map((s) => s.count);

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
