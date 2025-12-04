import { Package, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetOrderProductsById } from "../../hooks/useOrder.js";
import { toIndianCurrency } from "../../utils/toIndianCurrency.js";

export default function OrderProductsDetailes() {
  const { id } = useParams();

  const { data: orderData, isLoading, isError } = useGetOrderProductsById(id);
  console.log("order product data", orderData);
  console.log("Data", orderData?.order_products[0]?.total_final_price);
  const InfoCard = ({ icon: Icon, title, children, bgColor, status }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`${bgColor} p-3 rounded-xl`}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {status && <InfoItem label="" value={status} badge={bgColor} />}
      </div>
      {children}
    </div>
  );

  const InfoItem = ({ label, value, badge }) => (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {badge ? (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge}`}>{value}</span>
      ) : (
        <p className="font-semibold text-gray-800">{value}</p>
      )}
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
          <p className="text-gray-600">Order ID: {orderData?.order_id}</p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <InfoCard
            icon={Package}
            title="Order Info"
            bgColor={
              orderData?.order_status === "Delivered"
                ? "bg-green-100 text-green-600"
                : orderData?.order_status === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : orderData?.order_status === "Shipped"
                    ? "bg-orange-100 text-orange-600"
                    : orderData?.order_status === "Returned"
                      ? "bg-purple-100 text-purple-600"
                      : orderData?.order_status === "Processing"
                        ? "bg-blue-100 text-blue-600"
                        : orderData?.order_status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600" // Default color for other statuses
            }
            status={orderData?.order_status}
          >
            <div className="space-y-4">
              <InfoItem label="Order Type" value={orderData?.order_type} />
              <InfoItem
                label="Order Date"
                value={new Date(orderData?.order_create_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>
          </InfoCard>

          <InfoCard
            icon={CreditCard}
            title="Payment"
            bgColor={
              orderData?.payment_status === "Paid"
                ? "bg-green-100 text-green-600"
                : orderData?.payment_status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : orderData?.payment_status === "Failed"
                    ? "bg-red-100 text-red-600"
                    : orderData?.payment_status === "Refunded"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
            }
            status={orderData?.payment_status}
          >
            <div className="space-y-4">
              <InfoItem label="Payment Method" value={orderData?.payment_method} />
              <div>
                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                  {orderData?.transaction_id}
                </p>
              </div>
              <InfoItem label="COD Available" value={orderData?.cash_on_delivery ? "Yes" : "No"} />
            </div>
          </InfoCard>

          <InfoCard icon={MapPin} title="Delivery Address" bgColor="bg-purple-100 text-purple-600">
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">
                {orderData?.address?.house_number}, {orderData?.address?.street}
              </p>
              <p>
                {orderData?.address?.city}, {orderData?.address?.district}
              </p>
              <p>
                {orderData?.address?.state} - {orderData?.address?.postal_code}
              </p>
              <p className="font-medium">{orderData?.address?.country}</p>
            </div>
          </InfoCard>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Order Products</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Product ID",
                    "Product Name",
                    "Color",
                    "Size",
                    "Model",
                    "Price",
                    "Qty",
                    "Discount",
                    "Tax",
                    "Total",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === "Qty"
                          ? "text-center"
                          : h === "Product ID" || h === "Product Name" || h === "Color" || h === "Size" || h === "Model"
                            ? "text-left"
                            : "text-right"
                        }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderData?.order_products?.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                        {p?.product_unique_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{p?.product_name}</div>
                      {/* <div className="text-xs text-gray-500">{p?.product_details?.barcode}</div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {p?.product_details?.product_color ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {p?.product_details?.product_size ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {p?.product_details?.model_number ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-800">
                      {toIndianCurrency(p?.total_base_price)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded-full">
                        {p?.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-green-600">
                      -{toIndianCurrency(p?.total_discount_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{toIndianCurrency(p?.total_tax_value)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-800 text-lg">
                      {toIndianCurrency(p?.total_final_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
          <div className="space-y-3">
            {[
              ["Subtotal", `₹${orderData?.order_products[0]?.total_final_price}`, "text-gray-700"],
              [
                "Shipping Charges",
                orderData?.shipping_charges === 0 ? "FREE" : `₹${orderData?.shipping_charges}`,
                "text-green-600",
              ],
              [
                "Discount",
                orderData?.order_products[0]?.total_discount_price === 0 ? "FREE" : `₹${orderData?.order_products[0]?.total_discount_price}`,
                "text-green-600",
              ],
              [
                "Tax",
                orderData?.order_products[0]?.total_tax_value === 0 ? "FREE" : `₹${orderData?.order_products[0]?.total_tax_value}`,
                "text-green-600",
              ],
              //   ["Tax Amount", `₹${orderData?.tax_amount}`, "text-gray-700"],
            ].map(([label, value, color]) => (
              <div key={label} className="flex justify-between text-gray-700">
                <span>{label}</span>
                <span className={`font-semibold ${color}`}>{value}</span>
              </div>
            ))}
            <div className="border-t-2 border-indigo-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total Amount</span>
                <div className="flex flex-row items-end text-right align-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">{orderData?.total_amount}</span>
                  <p className="text-right text-sm text-gray-500 mt-1">{orderData?.currency}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
