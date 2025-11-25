import React, { useState } from "react";
import { useGetAllOrders } from "../../hooks/useOrder";
import DynamicTable from "../../components/DynamicTable";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

const OrderListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetAllOrders({
    searchTerm: searchTerm,
    page: 1,
    limit: 10,
  });

  const orderData = data?.data || [];

  console.log(orderData,"orderData")

  const columns = [
    { key: "_id", label: "Order ID" },
    { key: "user_id", label: "Customer ID" },
    { key: "order_status", label: "Order Status" },
    { key: "payment_method", label: "Payment Method" },
    { key: "total_amount", label: "Total Amount" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-0">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-2 py-2">
            <PageHeader title="Orders" subtitle="Manage customer orders" />
          </div>

          {/* SEARCH (NO GAP) */}
          <div className="p-6 bg-gray-50  border-b">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search orders..."
                className=" max-w-md"
              />
          </div>

          {/* TABLE - Stick to top without gap */}
          <div className="p-6 bg-white">
            {isError ? (
              <p>Error loading orders</p>
            ) : (
              <DynamicTable
                data={orderData}
                columns={columns}
                loading={isLoading}
                sortable={true}
                itemsPerPage={10}
                emptyMessage={<p>No orders found</p>}
              />
            )}
          </div>
        </div>
      </div>
  );
};

export default OrderListManager;
