import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import DynamicTable from "../../components/DynamicTable";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

import { useCategoryDelete, useGetAllCategories } from "../../hooks/useCategory.js";

import CategoryEditModal from "./CategoryEditModal";
import CategoryManager from "./CategoryManager";
import DataTable from "../../components/Table.jsx";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useGetAllIndustries } from "../../hooks/useIndustry.js";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import { statusOptions } from "../../lib/constants.js";

const CategoryListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [sort, setSort] = useState("createdAt:desc");

  const [activeStatus, setActiveStatus] = useState("");
  // console.log("activeStatus", activeStatus);

  const statusFun = () => {
    if (activeStatus === "active") return true;
    if (activeStatus === "inactive") return false;

    return undefined; // ⭐ FIX — remove filter
  };


  const {
    data: categories,
    isLoading: loading,
    isError: error,
  } = useGetAllCategories({ search: searchTerm, page: currentPage + 1, limit: pageSize, sort, is_active: statusFun() });

  const { mutate: deleteCategory, isPending } = useCategoryDelete();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingCategory(null);
  }, []);

  const handleDelete = (targetcategory) => {
    const { category_unique_id, category_name } = targetcategory;

    if (window.confirm(`Delete ${category_name}?`)) {
      deleteCategory({ uniqueId: category_unique_id });
    }
  };
  const columns = [
    {
      field: "category_unique_id",
      headerName: "UNIQUE ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize font-bold",
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
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
      renderCell: (params) => <span className="font-semibold">{params.value || "Unnamed"}</span>,
    },

    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      type: "singleSelect",
      valueOptions: ["Active", "Inactive"],

      // Convert boolean → string for filters
      valueGetter: (params) => (params.value ? "Active" : "Inactive"),

      renderCell: (params) => (
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            params?.row?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {params?.row?.is_active ? "Active" : "Inactive"}
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

  return (
    <div className="min-h-screen bg-gray-50 py-0">
      <div className="flex flex-col gap-y-4 border border-gray-300 rounded-lg p-4 height-full border-blck">
        {/* HEADER */}
        <PageHeader
          title="Categories Manager"
          subtitle="Manage all product categories"
          actionLabel="Add New Category"
          onAction={() => setShowAddModal(true)}
        />

        {/* SEARCH */}
        {/* <div className="p-6 bg-gray-50 border-b"> */}
        <div className="flex items-center gap-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search industry types..." />
          <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={statusOptions} />
        </div>
        {/* </div> */}

        <DataTable
          rows={categories?.data || []}
          columns={columns}
          getRowId={(row) => row.category_unique_id}
          page={currentPage}
          pageSize={pageSize}
          totalCount={categories?.totalCount || 0}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          sort={sort}
          setSort={(newSort) => {
            const sortItem = newSort[0];
            setSort(sortItem ? `${sortItem.field}:${sortItem.sort}` : "");
          }}
        />

        {/* TABLE */}
        {/* <div className="p-6 bg-white">
          {error ? (
            <p>Error loading categories</p>
          ) : (
            <DynamicTable
              data={categories}
              columns={columns}
              loading={loading}
              sortable={true}
              itemsPerPage={8}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage={
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-2xl text-gray-600 font-medium">
                    {searchTerm
                      ? `No results for "${searchTerm}"`
                      : "No categories found"}
                  </p>
                  <p className="text-gray-500">
                    Click "Add New Category" to create one!
                  </p>
                </div>
              }
              excludeColumns={[
                "_id",
                "__v",
                "tenant_id",
                "createdAt",
                "updatedAt",
                "created_by",
                "updated_by",
              ]}
            />
          )}
        </div> */}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-lg">
            <CategoryManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && <CategoryEditModal category={editingCategory} onClose={handleCloseEditModal} />}
    </div>
  );
};

export default CategoryListManager;
