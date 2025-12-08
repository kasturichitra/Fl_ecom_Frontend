import React, { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import { useGetAllUsers } from "../../hooks/useUser";
import { useUserTableHeaderStore } from "../../stores/UserTableHeaderStore";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector";
import useDebounce from "../../hooks/useDebounce.js";
import { DEBOUNCED_DELAY } from "../../lib/constants";

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userHeaders, updateUserTableHeaders } = useUserTableHeaderStore();

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY); // useDebounce(searchTerm, DEBOUNCED_DELAY);

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
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useGetAllUsers({
    searchTerm: debouncedSearchTerm,
    sort: decodeURIComponent(sort),
    page: currentPage + 1,
    limit: pageSize,
    role: "user",
  });

  //   console.log("usersResponse", usersResponse);

  // Extract actual users array + total count
  const users = usersResponse || [];
  //   console.log("users", users);
  const totalUsers = usersResponse?.total || 0;

  const columns = [
    {
      field: "_id",
      headerName: "User ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 font-mono",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
          {params.value ? params.value.slice(-6).toUpperCase() : ""}
        </span>
      ),
    },
    {
      field: "username",
      headerName: "Name",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
    },
    {
      field: "phone_number",
      headerName: "Phone",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
      renderCell: (params) => params.value || "N/A",
    },
    // {
    //   field: "createdAt",
    //   headerName: "Joined Date",
    //   flex: 1,
    //   headerClassName: "custom-header",
    //   cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
    //   renderCell: (params) =>
    //     params.value ? new Date(params.value).toLocaleDateString() : "",
    // },
  ];

  const visibleColumns = columns.filter((col) => {
    const headerConfig = userHeaders.find((h) => h.key === col.headerName);
    return headerConfig ? headerConfig.value : true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-8xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <PageHeader title="Users List" subtitle="Manage all registered users" />

          {/* Search Bar */}
          <div className="p-6 bg-gray-50 border-b flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(0);
                }}
                placeholder="Search users by name, email, or ID..."
              />
              <ColumnVisibilitySelector
                headers={userHeaders}
                updateTableHeaders={updateUserTableHeaders}
                setIsDropdownOpen={setIsDropdownOpen}
                isDropdownOpen={isDropdownOpen}
                dropdownRef={dropdownRef}
              />
            </div>
          </div>

          {/* Table */}
          <div className="p-6 bg-white">
            {isLoading ? (
              <div className="text-center py-10">Loading users...</div>
            ) : isError ? (
              <div className="text-center py-10 text-red-600">Error: {error.message}</div>
            ) : (
              <DataTable
                rows={users}
                getRowId={(row) => row._id}
                columns={visibleColumns}
                page={currentPage}
                pageSize={pageSize}
                totalCount={totalUsers}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                sort={sort}
                setSort={(newSort) => {
                  const sortItem = newSort[0];
                  /*
                  { field: "createdAt", sort: "desc" }
                  createdAt:desc
                  */
                  setSort(sortItem ? `${sortItem.field}:${sortItem.sort}` : "");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
