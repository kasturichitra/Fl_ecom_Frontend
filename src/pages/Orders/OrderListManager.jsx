import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import { useGetAllOrders } from "../../hooks/useOrder";

const OrderListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0); // 0-based page

  const { data, isLoading, isError } = useGetAllOrders({
    searchTerm: searchTerm,
    page: currentPage + 1,
    limit: pageSize,
  });

  const handleRowClick = (params) => {
    const orderId = params.row._id;
    navigate(`/order-products-detailes/${orderId}`);
  };

  const columns = [
    {
      field: "_id",
      headerName: "ORDER ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 font-mono",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          {params?.value ?? ""}
        </span>
      ),
    },

    {
      field: "user_id",
      headerName: "CUSTOMER ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 font-medium",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {params?.value ?? ""}
        </span>
      ),
    },

    {
      field: "order_status",
      headerName: "ORDER STATUS",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 capitalize",
      renderCell: (params) => {
        const status = params?.value ?? "";
        const isDelivered = status === "delivered";
        const isPending = status === "pending";
        const isCancelled = status === "cancelled";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDelivered
                ? "bg-green-100 text-green-800"
                : isPending
                ? "bg-yellow-100 text-yellow-800"
                : isCancelled
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },

    {
      field: "payment_method",
      headerName: "PAYMENT METHOD",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 capitalize",
      renderCell: (params) => <span className="font-semibold text-gray-800">{params?.value ?? ""}</span>,
    },

    {
      field: "total_amount",
      headerName: "TOTAL AMOUNT",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700",
      renderCell: (params) => (
        <span className="font-semibold text-gray-900">₹ {params?.value?.toFixed(2) ?? "0.00"}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
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
            <DataTable
              rows={data?.data || []}
              getRowId={(row) => row?._id}
              columns={columns}
              page={currentPage}
              pageSize={pageSize}
              totalCount={data?.totalCount || 0}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              onRowClick={handleRowClick}
              pathname={pathname}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListManager;
