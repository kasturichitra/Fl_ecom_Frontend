import { useCallback, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SearchBar from "../../components/SearchBar.jsx";
import DataTable from "../../components/Table.jsx";
import { useDeleteIndustry, useGetAllIndustries, useUpdateIndustry } from "../../hooks/useIndustry";
import IndustryTypeEditModal from "./IndustryTypeEditModal";
import IndustryTypeManager from "./IndustryTypeManager";
import PageHeader from "../../components/PageHeader.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import { statusOptions } from "../../lib/constants.js";

const IndustryTypeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0); // 0-based page
  const [sort, setSort] = useState("createdAt:desc");

  const [activeStatus, setActiveStatus] = useState("");
  // console.log("activeStatus", activeStatus);

  const statusFun = () => {
    if (activeStatus === "active") return true;
    if (activeStatus === "inactive") return false;

    return undefined; // ⭐ FIX — remove filter
  };

  const {
    data: industryTypes,
    isLoading: loading,
    isError: error,
  } = useGetAllIndustries({
    search: debouncedSearchTerm,
    page: currentPage + 1, // API pages are 1-based
    limit: pageSize,
    sort,
    is_active: statusFun(),
  });

  const { mutateAsync: updateIndustry } = useUpdateIndustry({
    onSettled: () => setEditingIndustry(false),
  });

  const { mutateAsync: deleteIndustry } = useDeleteIndustry();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleUpdate = async (formData) => {
    if (!editingIndustry) return;
    await updateIndustry({
      id: editingIndustry.industry_unique_id,
      data: formData,
    });
  };

  const handleEdit = useCallback((item) => {
    setEditingIndustry(item);
  }, []);

  const handleDelete = useCallback(async (item) => {
    if (window.confirm(`Delete ${item.industry_name}?`)) {
      await deleteIndustry(item.industry_unique_id);
    }
  }, []);

  const columns = [
    {
      field: "industry_unique_id",
      headerName: "UNIQUE ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize font-bold",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{params.value}</span>
      ),
    },
    {
      field: "industry_name",
      headerName: "INDUSTRY NAME",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
      renderCell: (params) => <span className="font-semibold">{params.value}</span>,
    },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      type: "singleSelect", // Enables filter dropdown
      valueOptions: ["Active", "Inactive"], // Shows in filter
      valueGetter: (params) => (params.value ? "Active" : "Inactive"), // Convert boolean → string
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            params.row?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {params.row?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      filterable: false,
      width: 150,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 flex gap-1",
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex gap-2 align-center">
          <button onClick={() => handleEdit(params.row)} className="cursor-pointer">
            <FaEdit size={18} className="text-[#4f46e5]" />
          </button>
          <button onClick={() => handleDelete(params.row)}>
            <MdDelete size={18} className="text-[#4f46e5]" />
          </button>
        </div>
      ),
    },
  ];

  // Pagination handlers

  return (
    <>
      <div className="flex flex-col gap-y-4 border border-gray-300 rounded-lg p-4 height-full">
        <PageHeader
          title="Industry Types"
          subtitle="Manage all industry classifications"
          actionLabel="Add New Industry"
          onAction={() => setShowAddModal(true)}
        />
        <div className="flex items-center gap-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search industry types..." />
          <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={statusOptions} />
        </div>

        <DataTable
          rows={industryTypes?.data || []}
          getRowId={(row) => row.industry_unique_id}
          columns={columns}
          page={currentPage}
          pageSize={pageSize}
          totalCount={industryTypes?.totalCount || 0}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          sort={sort}
          setSort={(newSort) => {
            const sortItem = newSort[0];

            setSort(sortItem ? `${sortItem.field}:${sortItem.sort}` : "");
          }}
        />
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl"
            >
              ×
            </button>
            <IndustryTypeManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingIndustry && (
        <IndustryTypeEditModal
          formData={editingIndustry}
          onSubmit={handleUpdate}
          closeModal={() => setEditingIndustry(null)}
        />
      )}
    </>
  );
};

export default IndustryTypeList;
