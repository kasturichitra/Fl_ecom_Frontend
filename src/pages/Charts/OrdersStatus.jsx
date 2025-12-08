import React from "react";
import CommonPieChart from "./CommonPieChart";
import { useGetAllOrders } from "../../hooks/useOrder";
import { toIndianCurrency } from "../../utils/toIndianCurrency";

const OrdersStatusChart = () => {
  const { data: OrdersData, isLoading, isError } = useGetAllOrders({
    page: 1,
    limit: 1000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading orders</p>;

  const orders = OrdersData?.data || [];

  const labels = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  const stats = labels.map((status) => {
    const filtered = orders.filter((o) => o?.order_status === status);
    const count = filtered.length;
    const total = filtered.reduce((sum, o) => sum + (o?.total_amount || 0), 0);

    return {
      count,
      totalAmount: toIndianCurrency(total),
      percentage: orders.length ? ((count / orders.length) * 100).toFixed(1) : 0,
    };
  });

  const counts = stats.map((s) => s.count);

  const colors = ["#a78bfa", "#60a5fa", "#93c5fd", "#6ee7b7", "#f87171", "#fb923c"];

  return (
    <CommonPieChart
      title="Orders Status Overview"
      labels={labels}
      counts={counts}
      stats={stats}
      colors={colors}
    />
  );
};

export default OrdersStatusChart;
