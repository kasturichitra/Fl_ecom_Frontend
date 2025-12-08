import React from "react";
import Orders from "../OrdersStatus";
import OrderTypeChart from "../OrderTypeChart";
import PaymentMethodChart from "../PaymentMethodChart";
import OrdersLineChart from "../OrdersLineChart";
import UsersLineChart from "../UsersLineChart";

const OverallTabComponent = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Orders />
        <OrderTypeChart />
        <PaymentMethodChart />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <OrdersLineChart />
        <UsersLineChart />
      </div>
    </div>
  );
};

export default OverallTabComponent;
