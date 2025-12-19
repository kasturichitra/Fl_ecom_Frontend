import { Activity, useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import { useGetAllUsers } from "../../hooks/useUser";
import EmployeeManager from "./EmployeeManager";
import { useEmployeTableHeaderStore } from "../../stores/EmployeTableHeaderStore";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector";
import useDebounce from "../../hooks/useDebounce.js";
import { DEBOUNCED_DELAY } from "../../lib/constants";

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { employeeHeaders, updateEmployeeTableHeaders } = useEmployeTableHeaderStore();

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
  } = useGetAllUsers({
    searchTerm: debouncedSearchTerm,
    page: currentPage + 1,
    limit: pageSize,
    role: "employee",
  });

  const handleCloseAdd = () => setShowAddModal(false);

  const columns = [
    {
      field: "_id",
      headerName: "Employee ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 font-mono",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {params?.value ? params?.value.slice(-6).toUpperCase() : ""}
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
      renderCell: (params) => params?.value || "N/A",
    },
    // {
    //   field: "role",
    //   headerName: "Employee Role",
    //   flex: 0.8,
    //   headerClassName: "custom-header",
    //   cellClassName: "px-6 py-4 text-left text-sm text-gray-600 capitalize",
    //   renderCell: (params) => (
    //     <span
    //       className={`px-3 py-1 rounded-full text-xs font-bold ${
    //         params.value === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
    //       }`}
    //     >
    //       {params.value || "User"}
    //     </span>
    //   ),
    // },
    {
      field: "createdAt",
      headerName: "Joined Date",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
      renderCell: (params) => new Date(params?.value).toLocaleDateString(),
    },
  ];

  const visibleColumns = columns?.filter((col) => {
    const headerConfig = employeeHeaders?.find((h) => h?.key === col?.headerName);
    return headerConfig ? headerConfig?.value : true;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="max-w-8xl">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
            <PageHeader
              title="Employee Manager"
              subtitle="Manage all registered Employees"
              actionLabel="Create Employee"
              createPermission="user:create"
              onAction={() => setShowAddModal(true)}
            />

            <div className="p-6 bg-gray-50 border-b flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(0); // Reset to first page on search
                  }}
                  placeholder="Search users by name, email, or ID..."
                />
                <ColumnVisibilitySelector
                  headers={employeeHeaders}
                  updateTableHeaders={updateEmployeeTableHeaders}
                  setIsDropdownOpen={setIsDropdownOpen}
                  isDropdownOpen={isDropdownOpen}
                  dropdownRef={dropdownRef}
                />
              </div>
            </div>

            <div className="p-6 bg-white">
              {isLoading ? (
                <div className="text-center py-10">Loading users...</div>
              ) : isError ? (
                <div className="text-center py-10 text-red-600">Error: {error.message}</div>
              ) : (
                <DataTable
                  rows={employees}
                  getRowId={(row) => row._id}
                  columns={visibleColumns}
                  page={currentPage}
                  pageSize={pageSize}
                  totalCount={employees.length}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                  sort="" // Client-side sorting not implemented yet, or can be added if needed
                  setSort={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {showAddModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseAdd}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl z-10"
            >
              ×
            </button>
            <EmployeeManager onCancel={handleCloseAdd} />
          </div>
        </div>
      )} */}

      <Activity mode={showAddModal ? "visible" : "hidden"}>
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseAdd}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl z-10"
            >
              ×
            </button>
            <EmployeeManager onCancel={handleCloseAdd} />
          </div>
        </div>
      </Activity>
    </>
  );
};

export default EmployeeList;
