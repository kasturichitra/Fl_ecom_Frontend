import React from "react";
import OrdersStatusChart from "../OrdersStatus";
import OrderTypeChart from "../OrderTypeChart";
import PaymentMethodChart from "../PaymentMethodChart";
import OrdersTrendChart from "../OrdersTrendChart";
import UsersTrendChart from "../UsersTrendChart";

const OverallTabComponent = () => {
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  // Optional: Memoize params if needed, but simple props passing is fine here.

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-center justify-end pr-2">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">From</label>
          <input type="date" value={fromDate} onChange={handleFromDateChange} className="border rounded p-2 text-sm" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">To</label>
          <input type="date" value={toDate} onChange={handleToDateChange} className="border rounded p-2 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OrdersStatusChart from={fromDate} to={toDate} />
        <OrderTypeChart from={fromDate} to={toDate} />
        <PaymentMethodChart from={fromDate} to={toDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrdersTrendChart />
        <UsersTrendChart />
      </div>
    </div>
  );
};

export default OverallTabComponent;
