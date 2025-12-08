import React from "react";
import CommonPieChart from "./CommonPieChart";
import { useGetAllOrders } from "../../hooks/useOrder";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

const OrderTypeChart = () => {
  const { data: OrdersData, isLoading, isError } = useGetAllOrders({
    page: 1,
    limit: 1000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading order types</p>;

  const orders = OrdersData?.data || [];
  const labels = ["Online", "Offline"];

  const stats = labels.map((type) => {
    const filtered = orders.filter((o) => o?.order_type === type);
    const count = filtered.length;
    const total = filtered.reduce((sum, o) => sum + (o?.total_amount || 0), 0);

    return {
      count,
      totalAmount: toIndianCurrency(total),
      percentage: orders.length ? ((count / orders.length) * 100).toFixed(1) : 0,
    };
  });

  const counts = stats.map((s) => s.count);

  const colors = ["#60a5fa", "#fb923c"];

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
