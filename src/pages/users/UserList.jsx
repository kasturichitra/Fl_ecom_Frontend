import React, { useState, useMemo } from "react";
import { useGetAllUsers } from "../../hooks/useUser";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import UserManager from "./UserManager";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: users, isLoading, isError, error } = useGetAllUsers();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user._id?.toLowerCase().includes(searchLower)
      );
    });
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleCloseAdd = () => setShowAddModal(false);

  const columns = [
    {
      field: "_id",
      headerName: "USER ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 font-mono",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {params.value ? params.value.slice(-6).toUpperCase() : ""}
        </span>
      ),
    },
    {
      field: "username",
      headerName: "NAME",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 1.5,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
    },
    {
      field: "phone_number",
      headerName: "PHONE",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "role",
      headerName: "ROLE",
      flex: 0.8,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600 capitalize",
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${params.value === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {params.value || "User"}
        </span>
      )
    },
    {
      field: "createdAt",
      headerName: "JOINED DATE",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-600",
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
            <PageHeader
              title="User Manager"
              subtitle="Manage all registered users"
              actionLabel="Create User"
              onAction={() => setShowAddModal(true)}
            />

            <div className="p-6 bg-gray-50 border-b flex items-center justify-between gap-4">
              <div className="max-w-md w-full">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(0); // Reset to first page on search
                  }}
                  placeholder="Search users by name, email, or ID..."
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
                  rows={paginatedUsers}
                  getRowId={(row) => row._id}
                  columns={columns}
                  page={currentPage}
                  pageSize={pageSize}
                  totalCount={filteredUsers.length}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                  sort="" // Client-side sorting not implemented yet, or can be added if needed
                  setSort={() => { }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseAdd}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl z-10"
            >
              ×
            </button>
            <UserManager onCancel={handleCloseAdd} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
