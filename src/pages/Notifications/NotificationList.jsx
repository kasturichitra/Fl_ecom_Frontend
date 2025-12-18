import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useNotification } from "../../hooks/useNotification";
import DataTable from "../../components/Table";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import useDebounce from "../../hooks/useDebounce.js";
import { DEBOUNCED_DELAY } from "../../lib/constants.js";
import { notificationColumns } from "../../lib/columns.jsx";

const NotificationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState("createdAt:desc");

  // Date filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY);

  // Format dates for API (YYYY-MM-DD)
  const fromDate = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
  const toDate = endDate ? format(endDate, "yyyy-MM-dd") : undefined;

  // Reset page when search or date changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, fromDate, toDate]);

  const { data, isLoading, isError } = useNotification({
    search: debouncedSearchTerm,
    page: currentPage + 1,
    limit: pageSize,
    sort,
    fromDate,
    toDate,
    role : "admin"
  });

  const notifications = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <PageHeader title="Notifications" subtitle="View all your notifications" />

          {/* Filters Row */}
          <div className="p-6 flex flex-wrap items-center gap-4 bg-gray-50 border-b">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search notifications..."
            />

            {/* Date Range Picker */}
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-300 px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">From:</span>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate || new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start date"
                  className="w-32 text-sm border-0 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">To:</span>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End date"
                  className="w-32 text-sm border-0 focus:outline-none"
                />
              </div>

              {(startDate || endDate) && (
                <button
                  onClick={clearDates}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="p-6 bg-white">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading notifications...</div>
            ) : isError ? (
              <div className="text-center py-12 text-red-600">Failed to load notifications</div>
            ) : (
              <DataTable
                rows={notifications}
                columns={notificationColumns}
                getRowId={(row) => row?._id}
                page={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                sort={sort}
                setSort={(newSort) => {
                  const item = newSort[0];
                  setSort(item ? `${item.field}:${item.sort}` : "createdAt:desc");
                }}
                loading={isLoading}
                noRowsOverlay={
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <p className="text-xl font-medium">No notifications found</p>
                    <p className="text-sm mt-2">
                      {searchTerm || startDate || endDate
                        ? "Try adjusting your filters"
                        : "You have no notifications at the moment"}
                    </p>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;