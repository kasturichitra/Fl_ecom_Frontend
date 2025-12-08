import { useGetAllUsers } from "../../hooks/useUser";
import { MONTHS } from "../../lib/constants";
import ReusableLineChart from "./ReusableLineChart";

const UsersTrendChart = () => {
  const {
    data: UsersData,
    isLoading,
    isError,
  } = useGetAllUsers({
    searchTerm: "",
    sort: "",
    page: 1,
    limit: 1000,
    role: "",
  });

  // Generate random data for Users (using random dataset for now)
  // TODO: Once API supports user trends, replace this with real data
  const usersByMonth = MONTHS.map(() => Math.floor(Math.random() * 50 + 10));

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
