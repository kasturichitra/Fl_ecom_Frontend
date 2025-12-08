import React from "react";
import Orders from "./Charts/OrdersStatus";
import OrderTypeChart from "./Charts/OrderTypeChart";
import PaymentMethodChart from "./Charts/PaymentMethodChart";
import OrdersLineChart from "./Charts/OrdersLineChart";

const Dashboard = () => {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-3">
      {/* Top row: 3 charts */}
      <Orders />
      <OrderTypeChart />
      <PaymentMethodChart />

      {/* Second row: Line chart */}
      <div className="md:col-span-1 mt-6 md:mt-0">
        <OrdersLineChart />
      </div>
    </div>
  );
};

export default Dashboard;
