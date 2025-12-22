import { Activity, useCallback, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import DataTable from "../../components/Table.jsx";
import { useDeleteIndustry, useGetAllIndustries, useUpdateIndustry } from "../../hooks/useIndustry";
import { DEBOUNCED_DELAY, statusOptions } from "../../lib/constants.js";
import { useIndustryTableHeadersStore } from "../../stores/IndustryTableHeadersStore.js";
import IndustryTypeEditModal from "./IndustryTypeEditModal";
import IndustryTypeManager from "./IndustryTypeManager";
import useDebounce from "../../hooks/useDebounce.js";
import useCheckPermission from "../../hooks/useCheckPermission.js";
import { industryTypeColumns } from "../../lib/columns.jsx";
import VerifyPermission from "../../middleware/verifyPermission.js";

const IndustryTypeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState("createdAt:desc");
  const { industryHeaders, updateTableHeaders } = useIndustryTableHeadersStore();
  const [activeStatus, setActiveStatus] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const canUpdate = useCheckPermission("industry:update");
  const canDelete = useCheckPermission("industry:delete");

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY);

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [handleClickOutside]);

  const statusFun = () => {
    if (activeStatus === "active") return true;
    if (activeStatus === "inactive") return false;
    return undefined;
  };

  const {
    data: industryTypes,
    isLoading: loading,
    isError: error,
  } = useGetAllIndustries({
    search: debouncedSearchTerm,
    page: currentPage + 1,
    limit: pageSize,
    sort,
    is_active: statusFun(),
  });

  const { mutateAsync: updateIndustry, isPending: isUpdatingIndustry } = useUpdateIndustry({
    onSettled: () => setEditingIndustry(false),
  });

  const { mutateAsync: deleteIndustry, isPending: isDeletingIndustry } = useDeleteIndustry();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);

  // Debounce search
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //     setCurrentPage(0);
  //   }, 500);
  //   return () => clearTimeout(handler);
  // }, [searchTerm]);

  const handleUpdate = async (formData) => {
    if (!editingIndustry) return;
    await updateIndustry({
      id: editingIndustry?.industry_unique_id,
      data: formData,
    });
  };

  const handleEdit = useCallback((item) => {
    setEditingIndustry(item);
  }, []);

  const handleDelete = useCallback(async (item) => {
    if (window.confirm(`Delete ${item?.industry_name}?`)) {
      await deleteIndustry(item?.industry_unique_id);
    }
  }, []);

  const columns = [
    {
      field: "industry_unique_id",
      headerName: "UNIQUE ID",
      flex: 1,
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{params.value}</span>
      ),
    },
    {
      field: "industry_name",
      headerName: "INDUSTRY NAME",
      flex: 1,
      renderCell: (params) => <span className="font-semibold text-gray-800">{params.value}</span>,
    },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      valueGetter: (params) => (params?.row?.is_active ? "Active" : "Inactive"),
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${params?.row?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {params?.row?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (canUpdate || canDelete) {
    columns.push({
      field: "actions",
      headerName: "ACTIONS",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex gap-3 items-center">
          <VerifyPermission permission="industry:update">
            <button
              onClick={() => handleEdit(params?.row)}
              className="text-indigo-600 hover:text-indigo-800 transition"
              title="Edit"
            >
              <FaEdit size={18} />
            </button>
          </VerifyPermission>
          <VerifyPermission permission="industry:delete">
            <button
              onClick={() => handleDelete(params?.row)}
              disabled={isDeletingIndustry}
              className="text-indigo-600 hover:text-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete"
            >
              <MdDelete size={18} />
            </button>
          </VerifyPermission>
        </div>
      ),
    });
  }

  // const visibleColumns = columns.filter((col) => {
  //   const headerConfig = columns.find((h) => h.key === col.headerName);
  //   return headerConfig ? headerConfig.value : true;
  // });
  const visibleColumns = columns?.filter((col) => {
    const headerConfig = industryHeaders?.find((h) => h?.key === col?.headerName);
    return headerConfig ? headerConfig?.value : true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-8xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <PageHeader
            title="Industry Types"
            subtitle="Manage all industry classifications"
            actionLabel="Add New Industry"
            createPermission="industry:create"
            onAction={() => setShowAddModal(true)}
          />

          {/* Filters Row */}
          <div className="p-6 flex flex-wrap items-center gap-4 bg-gray-50 border-b">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search industry types..." />
            <ColumnVisibilitySelector
              headers={industryHeaders}
              updateTableHeaders={updateTableHeaders}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
            />
            <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={statusOptions} placeholder="Status" />
          </div>

          {/* Table */}
          <div className="p-6 bg-white">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading industries...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">Failed to load industries</div>
            ) : !industryTypes?.data?.length ? (
              <div className="text-center py-12 text-gray-500">No industries found</div>
            ) : (
              <DataTable
                rows={industryTypes?.data || []}
                getRowId={(row) => row?.industry_unique_id}
                columns={visibleColumns}
                page={currentPage}
                pageSize={pageSize}
                totalCount={industryTypes?.totalCount || 0}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                sort={sort}
                setSort={(newSort) => {
                  const sortItem = newSort[0];
                  setSort(sortItem ? `${sortItem?.field}:${sortItem?.sort}` : "");
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}

      <Activity mode={showAddModal ? "visible" : "hidden"}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full">
            <IndustryTypeManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      </Activity>

      {/* Edit Modal */}
      {editingIndustry && (
        <IndustryTypeEditModal
          formData={editingIndustry}
          onSubmit={handleUpdate}
          closeModal={() => setEditingIndustry(null)}
          isSubmitting={isUpdatingIndustry}
        />
      )}
      {/* <Activity mode={editingIndustry ? "visible" : "hidden"}>
        <IndustryTypeEditModal
          formData={editingIndustry}
          onSubmit={handleUpdate}
          closeModal={() => setEditingIndustry(null)}
        />
      </Activity> */}
    </div>
  );
};

export default IndustryTypeList;
