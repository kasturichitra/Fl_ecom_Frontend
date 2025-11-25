import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import DynamicTable from "../../components/DynamicTable";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

import {
  useCategoryDelete,
  useGetAllCategories,
} from "../../hooks/useCategory.js";

import CategoryEditModal from "./CategoryEditModal";
import CategoryManager from "./CategoryManager";

const CategoryListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: categories, isLoading: loading, isError: error } =
    useGetAllCategories({ search: searchTerm });

  const { mutate: deleteCategory, isPending } = useCategoryDelete();

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingCategory(null);
  }, []);

  const handleDelete = (targetcategory) => {
    const { category_unique_id } = targetcategory;
    deleteCategory({ uniqueId: category_unique_id });
  };

  const columns = [
    {
      key: "category_unique_id",
      label: "UNIQUE ID",
      render: (value) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "category_name",
      label: "CATEGORY NAME",
      render: (value) => (
        <span className="font-semibold">{value || "Unnamed"}</span>
      ),
    },
    {
      key: "is_active",
      label: "STATUS",
      render: (value) => (
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">

        {/* HEADER */}
        <PageHeader
          title="Categories Manager"
          subtitle="Manage all product categories"
          actionLabel="Add New Category"
          onAction={() => setShowAddModal(true)}
        />

        {/* SEARCH */}
        <div className="p-6 bg-gray-50 border-b">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search categories..."
            className="mx-auto max-w-md"
          />
        </div>

        {/* TABLE */}
        <div className="p-6 bg-white">
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
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-xl shadow-lg">
            <CategoryManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <CategoryEditModal
          category={editingCategory}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default CategoryListManager;
