import { useGetUsersTrend } from "../../hooks/useDashboard";
import { MONTHS } from "../../lib/constants";
import ReusableLineChart from "./ReusableLineChart";

const UsersTrendChart = () => {
  const { data: usersData, isLoading, isError } = useGetUsersTrend();

  // Generate random data for Users (using random dataset for now)
  // TODO: Once API supports user trends, replace this with real data
  const defaultUsersByMonth = MONTHS.map(() => Math.floor(Math.random() * 50 + 10));

  const usersByMonth = usersData?.map((user) => user.count) || defaultUsersByMonth;
  
  return (
    <ReusableLineChart
      labels={MONTHS}
      dataValues={usersByMonth}
      datasetLabel="Number of Users"
      borderColor="rgb(153, 102, 255)"
      backgroundColor="rgba(153, 102, 255, 0.5)"
      chartTitle="Users Over Months"
      cardTitle="Users Trend"
      tooltipLabel="Users"
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default UsersTrendChart;
