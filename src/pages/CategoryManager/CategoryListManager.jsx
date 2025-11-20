import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCategory, fetchCategories } from "../../redux/categorySlice";

import PageLayoutWithTable from "../../components/PageLayoutWithTable";
import CategoryEditModal from "./CategoryEditModal";
import CategoryManager from "./CategoryManager";

const CategoryListManager = () => {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state?.categories?.items ?? []);
  const loading = useSelector((state) => state?.categories?.loading ?? false);
  const error = useSelector((state) => state?.categories?.error);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const tenantId = "tenant123";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTE4YjA3YzRmNjM2OTY1OWRiNTU3ZSIsImlhdCI6MTc2MzExMjQxOCwiZXhwIjoxNzY1NzA0NDE4fQ.SkiLEPCmg4HEQAIMoBT4C-JTS09J8BYR2eivRJxlAas";

  useEffect(() => {
    dispatch(fetchCategories({ token, tenantId }));
  }, [dispatch, token, tenantId]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (cat) =>
        (cat.category_name || "").toLowerCase().includes(term) ||
        (cat.category_unique_id || "").toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingCategory(null);
  }, []);

  const handleDelete = useCallback(
    (category) => {
      if (!window.confirm(`Delete "${category.category_name}"?`)) return;

      dispatch(
        deleteCategory({
          uniqueId: category.category_unique_id,
          token,
          tenantId,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchCategories({ token, tenantId }));
        })
        .catch(() => alert("Failed to delete category"));
    },
    [dispatch, token, tenantId]
  );

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
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageLayoutWithTable
        title="Categories Manager"
        subtitle="Manage all product categories"
        buttonLabel="Add New Category"
        onAddClick={() => setShowAddModal(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tableData={filteredCategories}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        error={error}
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
        itemsPerPage={8}
      />

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
    </>
  );
};

export default CategoryListManager;
