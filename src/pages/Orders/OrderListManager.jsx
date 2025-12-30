import { useCallback, useEffect, useRef, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import { useGetAllOrders } from "../../hooks/useOrder";
import { DropdownFilter } from "../../components/DropdownFilter";
import { DEBOUNCED_DELAY, ORDER_STATUS_OPTIONS, ORDER_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS } from "../../lib/constants";
import { toIndianCurrency } from "../../utils/toIndianCurrency";
import { useOrderTableHeadersStore } from "../../stores/OrderTableHeaderStore";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector";
import useDebounce from "../../hooks/useDebounce.js";
import { useOrderFiltersStore } from "../../stores/orderFiltersStore.js";

const OrderListManager = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* -------------------- ZUSTAND -------------------- */
  const {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  } = useOrderFiltersStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { orderHeaders, updateOrderHeaders } = useOrderTableHeadersStore();
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const debouncedSearchTerm = useDebounce(filters.search, DEBOUNCED_DELAY);

  const { data, isLoading, isError } = useGetAllOrders({
    searchTerm: debouncedSearchTerm,
    page: filters.page + 1,
    limit: filters.limit,
    order_status: filters.orderStatus,
    order_type: filters.orderType,
    payment_method: filters.paymentMethod,
  });

  const handleRowClick = (params) => {
    const orderId = params?.row?.order_id;
    navigate(`/order-products-detailes/${orderId}`);
  };

  const columns = [
    {
      field: "order_id",
      headerName: "ORDER ID",
      flex: 1,
      headerClassName: "custom-header",
      hideable: false,
      disableColumnMenu: true,
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
      hideable: false,
      disableColumnMenu: true,
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
      hideable: false,
      disableColumnMenu: true,
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 capitalize",
      renderCell: (params) => {
        const status = params?.value ?? "";
        const isDelivered = status === "Delivered";
        const isPending = status === "Pending";
        const isCancelled = status === "Cancelled";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${isDelivered
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
      hideable: false,
      disableColumnMenu: true,
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 capitalize",
      renderCell: (params) => <span className="font-semibold text-gray-800">{params?.value ?? ""}</span>,
    },
    {
      field: "order_type",
      headerName: "ORDER TYPE",
      flex: 1,
      headerClassName: "custom-header",
      hideable: false,
      disableColumnMenu: true,
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 capitalize",
      renderCell: (params) => <span className="font-semibold text-gray-800">{params?.value ?? ""}</span>,
    },

    {
      field: "total_amount",
      headerName: "TOTAL AMOUNT",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700",
      renderCell: (params) => <span>{toIndianCurrency(params?.value)}</span>,
    },
  ];

  const visibleColumns = columns?.filter((col) => {
    const headerConfig = orderHeaders?.find((h) => h?.key === col?.headerName);
    return headerConfig ? headerConfig?.value : true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        {/* HEADER */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white">
          <PageHeader title="Orders" subtitle="Manage customer orders" />
        </div>

        {/* SEARCH (NO GAP) */}
        <div className="p-6 bg-gray-50 border-b flex items-center gap-4">
          <SearchBar
            searchTerm={filters.search}
            onSearchChange={(value) => setFilters({ search: value, page: 0 })}
            placeholder="Search orders..."
            className=" max-w-md"
          />
          <ColumnVisibilitySelector
            headers={orderHeaders}
            updateTableHeaders={updateOrderHeaders}
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
            dropdownRef={dropdownRef}
          />

          <DropdownFilter
            value={filters.orderStatus}
            onSelect={(val) => setFilters({ orderStatus: val, page: 0 })}
            data={ORDER_STATUS_OPTIONS}
            placeholder="Order Status"
          />
          <DropdownFilter
            value={filters.paymentMethod}
            onSelect={(val) => setFilters({ paymentMethod: val, page: 0 })}
            data={PAYMENT_METHOD_OPTIONS}
            placeholder="Payment Method"
          />
          <DropdownFilter
            value={filters.orderType}
            onSelect={(val) => setFilters({ orderType: val, page: 0 })}
            data={ORDER_TYPE_OPTIONS}
            placeholder="Order Type"
          />
          {/* 🔄 Reset Filters */}
          <button
            onClick={resetFilters}
            title="Reset filters"
            className="p-2 border rounded-md bg-white hover:bg-gray-100 transition"
          >
            <FiRefreshCcw size={18} />
          </button>
        </div>

        {/* TABLE - Stick to top without gap */}
        <div className="p-6 bg-white">
          {isError ? (
            <p>Error loading orders</p>
          ) : (
            <DataTable
              rows={data?.data || []}
              getRowId={(row) => row?._id}
              columns={visibleColumns}
              page={filters.page}
              pageSize={filters.limit}
              totalCount={data?.totalCount || 0}
              setCurrentPage={(page) => setFilter("page", page)}
              setPageSize={(limit) => setFilters({ limit, page: 0 })}
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
