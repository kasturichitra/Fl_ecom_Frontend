import { useGetOrdersTrend } from "../../hooks/useDashboard";
import { MONTHS } from "../../lib/constants";
import ReusableLineChart from "./ReusableLineChart";

const OrdersTrendChart = () => {
  const { data: ordersData, isLoading, isError } = useGetOrdersTrend();

  // Generate random data for fallback
  const defaultOrdersByMonth = MONTHS.map(() => Math.floor(Math.random() * 100 + 100));

  const ordersByMonth = ordersData?.map((order) => order.count) || defaultOrdersByMonth;

  return (
    <ReusableLineChart
      labels={MONTHS}
      dataValues={ordersByMonth}
      datasetLabel="Number of Orders"
      borderColor="rgb(75, 192, 192)"
      backgroundColor="rgba(75, 192, 192, 0.5)"
      chartTitle="Orders Over Months"
      cardTitle="Orders Trend"
      tooltipLabel="Orders"
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default OrdersTrendChart;
