import { useGetAllOrders } from "../../../hooks/useOrder";
import { useGetAllUsers } from "../../../hooks/useUser";
import { MONTHS } from "../../../lib/constants";
import OrdersStatusChart from "../OrdersStatus";
import OrderTypeChart from "../OrderTypeChart";
import PaymentMethodChart from "../PaymentMethodChart";
import ReusableLineChart from "../ReusableLineChart";

const OverallTabComponent = () => {
  // Fetch Orders Data
  const {
    data: OrdersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetAllOrders({
    page: 1,
    limit: 1000,
    order_status: "",
    order_type: "",
    payment_method: "",
  });

  // Fetch Users Data
  const {
    data: UsersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetAllUsers({
    searchTerm: "",
    sort: "",
    page: 1,
    limit: 1000,
    role: "",
  });

  // Generate random data for Orders (using random dataset for now)
  const defaultOrdersByMonth = MONTHS.map(() => Math.floor(Math.random() * 100 + 100));

  // Generate random data for Users (using random dataset for now)
  // const defaultUsersByMonth = MONTHS.map(() => Math.floor(Math.random() * 50 + 10));
  const usersByMonth = MONTHS.map(() => Math.floor(Math.random() * 50 + 10));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <OrdersStatusChart />
        <OrderTypeChart />
        <PaymentMethodChart />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Orders Line Chart */}
        <ReusableLineChart
          labels={MONTHS}
          dataValues={ordersByMonth}
          datasetLabel="Number of Orders"
          borderColor="rgb(75, 192, 192)"
          backgroundColor="rgba(75, 192, 192, 0.5)"
          chartTitle="Orders Over Months"
          cardTitle="Orders Trend"
          tooltipLabel="Orders"
          isLoading={ordersLoading}
          isError={ordersError}
        />

        {/* Users Line Chart */}
        <ReusableLineChart
          labels={MONTHS}
          dataValues={usersByMonth}
          datasetLabel="Number of Users"
          borderColor="rgb(153, 102, 255)"
          backgroundColor="rgba(153, 102, 255, 0.5)"
          chartTitle="Users Over Months"
          cardTitle="Users Trend"
          tooltipLabel="Users"
          isLoading={usersLoading}
          isError={usersError}
        />
      </div>
    </div>
  );
};

export default OverallTabComponent;
