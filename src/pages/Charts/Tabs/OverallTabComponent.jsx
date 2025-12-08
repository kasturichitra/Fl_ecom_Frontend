import OrdersStatusChart from "../OrdersStatus";
import OrderTypeChart from "../OrderTypeChart";
import PaymentMethodChart from "../PaymentMethodChart";
import OrdersTrendChart from "../OrdersTrendChart";
import UsersTrendChart from "../UsersTrendChart";

const OverallTabComponent = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <OrdersStatusChart />
        <OrderTypeChart />
        <PaymentMethodChart />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <OrdersTrendChart />
        <UsersTrendChart />
      </div>
    </div>
  );
};

export default OverallTabComponent;
