import { useCallback, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table.jsx";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";

import { useCategoryDelete, useGetAllCategories } from "../../hooks/useCategory.js";
import { useGetAllIndustries } from "../../hooks/useIndustry.js";
import { statusOptions } from "../../lib/constants.js";
import { useCategoryTableHeadersStore } from "../../stores/CategoryTableHeaderStore.js";

import CategoryEditModal from "./CategoryEditModal";
import CategoryManager from "./CategoryManager";

const CategoryListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [industryId, setIndustryId] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [sort, setSort] = useState("createdAt:desc");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { categoryHeaders, updateCategoryTableHeaders } = useCategoryTableHeadersStore();

  // Click outside to close column selector
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Status filter
  const getStatusFilter = () => {
    if (activeStatus === "active") return true;
    if (activeStatus === "inactive") return false;
    return undefined;
  };

  // Industries dropdown
  const { data: industriesData } = useGetAllIndustries();
  const formattedIndustries = [
    { label: "All Industries", value: "" },
    ...(industriesData?.data?.map((ind) => ({
      label: ind.industry_name,
      value: ind.industry_unique_id,
    })) || []),
  ];

  // Fetch categories
  const {
    data: categories,
    isLoading: loading,
    isError: error,
  } = useGetAllCategories({
    search: searchTerm,
    page: currentPage + 1,
    limit: pageSize,
    sort,
    is_active: getStatusFilter(),
    industry_unique_id: industryId || undefined,
  });

  const { mutate: deleteCategory } = useCategoryDelete();

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingCategory(null);
  }, []);

  const handleDelete = (category) => {
    if (window.confirm(`Delete "${category.category_name}"?`)) {
      deleteCategory({ uniqueId: category.category_unique_id });
    }
  };

  const columns = [
    {
      field: "category_unique_id",
      headerName: "UNIQUE ID",
      flex: 1,
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {params.value || "N/A"}
        </span>
      ),
    },
    {
      field: "category_name",
      headerName: "CATEGORY NAME",
      flex: 1,
      renderCell: (params) => <span className="font-semibold text-gray-800">{params.value || "Unnamed"}</span>,
    },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      valueGetter: (params) => (params.value ? "Active" : "Inactive"),
      renderCell: (params) => (
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            params.row.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {params.row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => handleEdit(params.row)}
            className="text-indigo-600 hover:text-indigo-800 transition"
            title="Edit"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(params.row)}
            className="text-indigo-600 hover:text-indigo-800 transition"
            title="Delete"
          >
            <MdDelete size={18} />
          </button>
        </div>
      ),
    },
  ];

  const visibleColumns = columns.filter((col) => {
    if (col.field === "actions") return true;
    const config = categoryHeaders.find((h) => h.key === col.headerName);
    return config ? config.value : true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-8xl mx-auto px-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <PageHeader
            title="Categories Manager"
            subtitle="Manage all product categories"
            actionLabel="Add New Category"
            onAction={() => setShowAddModal(true)}
          />

          {/* Filters */}
          <div className="px-6 py-4 flex flex-wrap items-center gap-4 bg-gray-50 border-b">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search categories..." />
            <ColumnVisibilitySelector
              headers={categoryHeaders}
              updateTableHeaders={updateCategoryTableHeaders}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
            />
            <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={statusOptions} placeholder="Status" />
            <DropdownFilter
              data={formattedIndustries}
              onSelect={setIndustryId}
              value={industryId}
              placeholder="Industry"
            />
          </div>

          {/* Table */}
          {/* <div className="p-4">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading categories...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">Failed to load categories</div>
            ) : !categories?.data?.length ? (
              <div className="text-center py-12 text-gray-500">No categories found</div>
            ) : (
              <DataTable
                rows={categories?.data || []}
                getRowId={(row) => row.category_unique_id}
                columns={visibleColumns}
                page={currentPage}
                pageSize={pageSize}
                totalCount={categories?.totalCount || 0}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                sort={sort}
                setSort={(newSort) => {
                  const item = newSort[0];
                  setSort(item ? `${item.field}:${item.sort}` : "");
                }}
              />
            )}
          </div> */}

          {/* Table - Always visible with beautiful empty state */}
          <div className="p-4">
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading categories...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">Failed to load categories</div>
              ) : (
                <DataTable
                  rows={categories?.data || []}
                  getRowId={(row) => row.category_unique_id}
                  columns={visibleColumns}
                  page={currentPage}
                  pageSize={pageSize}
                  totalCount={categories?.totalCount || 0}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                  sort={sort}
                  setSort={(newSort) => {
                    const item = newSort[0];
                    setSort(item ? `${item.field}:${item.sort}` : "");
                  }}
                  loading={loading}
                  // Beautiful empty state — table stays visible!
                  noRowsOverlay={
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                      <svg
                        className="w-20 h-20 mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.2}
                          d="M3 7h18M3 12h18M3 17h18"
                        />
                        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.5} />
                      </svg>
                      <p className="text-xl font-medium">No categories found</p>
                      <p className="text-sm mt-2">
                        {searchTerm || industryId || activeStatus !== ""
                          ? "Try changing your search or filters"
                          : "Click 'Add New Category' to create your first one"}
                      </p>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Category</h2>
              <button onClick={() => setShowAddModal(false)} className="text-3xl text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CategoryManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Category</h2>
              <button onClick={handleCloseEditModal} className="text-3xl text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <CategoryEditModal category={editingCategory} onClose={handleCloseEditModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryListManager;
