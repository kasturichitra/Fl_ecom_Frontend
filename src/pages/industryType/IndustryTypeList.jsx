import { Activity, useCallback, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";

import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import DataTable from "../../components/Table.jsx";

import {
  useDeleteIndustry,
  useGetAllIndustries,
  useUpdateIndustry,
} from "../../hooks/useIndustry";

import { DEBOUNCED_DELAY, statusOptions } from "../../lib/constants.js";
import { useIndustryTableHeadersStore } from "../../stores/IndustryTableHeadersStore.js";
import { useIndustryFiltersStore } from "../../stores/industryFiltersStore.js";

import IndustryTypeEditModal from "./IndustryTypeEditModal";
import IndustryTypeManager from "./IndustryTypeManager";

import useDebounce from "../../hooks/useDebounce.js";
import useCheckPermission from "../../hooks/useCheckPermission.js";
import VerifyPermission from "../../middleware/verifyPermission.js";

const IndustryTypeList = () => {
  /* -------------------- ZUSTAND -------------------- */
  const { industryHeaders, updateTableHeaders } =
    useIndustryTableHeadersStore();

  const {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  } = useIndustryFiltersStore();

  /* -------------------- LOCAL UI STATE (NON-FILTER) -------------------- */
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const canUpdate = useCheckPermission("industry:update");
  const canDelete = useCheckPermission("industry:delete");

  /* -------------------- DEBOUNCE SEARCH -------------------- */
  const debouncedSearchTerm = useDebounce(
    filters.search,
    DEBOUNCED_DELAY
  );

  /* -------------------- CLICK OUTSIDE -------------------- */
  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  /* -------------------- DATA FETCH -------------------- */
  const {
    data: industryTypes,
    isLoading: loading,
    isError: error,
  } = useGetAllIndustries({
    search: debouncedSearchTerm,
    page: filters.page + 1,
    limit: filters.limit,
    sort: filters.sort,
    is_active:
      filters.status === "active"
        ? true
        : filters.status === "inactive"
        ? false
        : "",
  });

  /* -------------------- MUTATIONS -------------------- */
  const { mutateAsync: updateIndustry, isPending: isUpdatingIndustry } =
    useUpdateIndustry({
      onSettled: () => setEditingIndustry(null),
    });

  const { mutateAsync: deleteIndustry, isPending: isDeletingIndustry } =
    useDeleteIndustry();

  /* -------------------- HANDLERS -------------------- */
  const handleUpdate = async (payload) => {
    if (!editingIndustry) return;
    await updateIndustry({
      id: editingIndustry.industry_unique_id,
      data: payload,
    });
  };

  const handleEdit = useCallback((item) => {
    setEditingIndustry(item);
  }, []);

  const handleDelete = useCallback(
    async (item) => {
      if (window.confirm(`Delete ${item?.industry_name}?`)) {
        await deleteIndustry(item?.industry_unique_id);
      }
    },
    [deleteIndustry]
  );

  /* -------------------- COLUMNS (UNCHANGED) -------------------- */
  const columns = [
    {
      field: "industry_unique_id",
      headerName: "UNIQUE ID",
      flex: 1,
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {params.value}
        </span>
      ),
    },
    {
      field: "industry_name",
      headerName: "INDUSTRY NAME",
      flex: 1,
      renderCell: (params) => (
        <span className="font-semibold text-gray-800">
          {params.value}
        </span>
      ),
    },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      valueGetter: (params) =>
        params?.row?.is_active ? "Active" : "Inactive",
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            params?.row?.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
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
            >
              <FaEdit size={18} />
            </button>
          </VerifyPermission>
          <VerifyPermission permission="industry:delete">
            <button
              onClick={() => handleDelete(params?.row)}
              disabled={isDeletingIndustry}
              className="text-indigo-600 hover:text-indigo-800 transition disabled:opacity-50"
            >
              <MdDelete size={18} />
            </button>
          </VerifyPermission>
        </div>
      ),
    });
  }

  const visibleColumns = columns.filter((col) => {
    const headerConfig = industryHeaders.find(
      (h) => h.key === col.headerName
    );
    return headerConfig ? headerConfig.value : true;
  });

  /* -------------------- UI (UNCHANGED) -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-8xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <PageHeader
            title="Industry Types"
            subtitle="Manage all industry classifications"
            actionLabel="Add New Industry"
            createPermission="industry:create"
            onAction={() => setShowAddModal(true)}
          />

          <div className="p-6 flex flex-wrap items-center gap-4 bg-gray-50 border-b">
            <SearchBar
              searchTerm={filters.search}
              onSearchChange={(value) =>
                setFilters({ search: value, page: 0 })
              }
              placeholder="Search industry types..."
            />

            <ColumnVisibilitySelector
              headers={industryHeaders}
              updateTableHeaders={updateTableHeaders}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
            />

            <DropdownFilter
              value={filters.status}
              onSelect={(value) =>
                setFilters({ status: value, page: 0 })
              }
              data={statusOptions}
              placeholder="Status"
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

          <div className="p-6 bg-white">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading industries...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                Failed to load industries
              </div>
            ) : !industryTypes?.data?.length ? (
              <div className="text-center py-12 text-gray-500">
                No industries found
              </div>
            ) : (
              <DataTable
                rows={industryTypes?.data || []}
                getRowId={(row) => row?.industry_unique_id}
                columns={visibleColumns}
                page={filters.page}
                pageSize={filters.limit}
                totalCount={industryTypes?.totalCount || 0}
                setCurrentPage={(page) =>
                  setFilter("page", page)
                }
                setPageSize={(limit) =>
                  setFilters({ limit, page: 0 })
                }
                sort={filters.sort}
                setSort={(newSort) => {
                  const sortItem = newSort[0];
                  setFilter(
                    "sort",
                    sortItem
                      ? `${sortItem.field}:${sortItem.sort}`
                      : ""
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Activity mode={showAddModal ? "visible" : "hidden"}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full">
            <IndustryTypeManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      </Activity>

      {editingIndustry && (
        <IndustryTypeEditModal
          formData={editingIndustry}
          onSubmit={handleUpdate}
          closeModal={() => setEditingIndustry(null)}
          isSubmitting={isUpdatingIndustry}
        />
      )}
    </div>
  );
};

export default IndustryTypeList;
