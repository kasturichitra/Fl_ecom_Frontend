// src/pages/ProductManager/ProductList.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "../../redux/productSlice";

import PageLayoutWithTable from "../../components/PageLayoutWithTable";
import ProductManager from "./ProductManager";
import ProductEditModal from "./ProductEditModal";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);


  // Demo login
  const token = "your-token";
  const tenantId = "tenant123";

  // Load on mount
  useEffect(() => {
    dispatch(fetchProducts({ token, tenantId }));
  }, [dispatch]);

  // Search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    const t = searchTerm.toLowerCase();

    return products.filter(
      (item) =>
        item.product_name?.toLowerCase().includes(t) ||
        item.product_unique_id?.toLowerCase().includes(t) ||
        item.category_unique_id?.toLowerCase().includes(t)
    );
  }, [products, searchTerm]);

  console.log(filteredProducts, "filteredProducts")

  // UPDATE handler
  const handleUpdate = async (formData) => {
    if (!editingProduct) return;
    setIsUpdating(true);

    try {
      await dispatch(
        updateProduct({
          originalId: editingProduct.product_unique_id,
          updatedData: formData,
          token,
          tenantId,
        })
      ).unwrap();

      await dispatch(fetchProducts({ token, tenantId }));

      navigate("/productList");
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // EDIT handler
  const handleEdit = useCallback((item) => {
    setEditingProduct(item);
  }, []);

  // DELETE handler
  const handleDelete = useCallback(
    (item) => {
      if (window.confirm(`Delete ${item.product_name}?`)) {
        dispatch(
          deleteProduct({
            uniqueId: item.product_unique_id,
            token,
            tenantId,
          })
        );
      }
    },
    [dispatch]
  );

  // TABLE COLUMNS
  const columns = [
    // {
    //   header: "Category Unique ID *",
    //   key: "category_unique_id",
    //   width: 20,
    // },
    // {
    //   header: "Brand Unique ID *",
    //   key: "brand_unique_id",
    //   width: 20,
    // },
    {
      header: "Product Unique ID *",
      key: "product_unique_id",
      width: 20,
    },
    {
      header: "Product Name *",
      key: "product_name",
      width: 20,
    },
    {
      header: "Price *",
      key: "price",
      width: 10,
    },
    {
      header: "Stock Quantity *",
      key: "stock_quantity",
      width: 10,
    },
    {
      header: "Min Order Limit *",
      key: "min_order_limit",
      width: 20,
    },
    {
      header: "Gender *",
      key: "gender",
      width: 20,
    }
  ];
  return (
    <>
      <PageLayoutWithTable
        title="Product Manager"
        subtitle="Manage all store products"
        buttonLabel="Add New Product"
        onAddClick={() => setShowAddModal(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tableData={filteredProducts}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        error={error}
        itemsPerPage={8}
        excludeColumns={[
          "_id",
          "__v",
          "tenant_id",
          "createdAt",
          "updatedAt",
          "created_by",
          "updated_by",
          "product_images",
          "product_attributes",
        ]}
        emptyMessage={
          <div className="text-center py-10 text-gray-500">
            No products found.
          </div>
        }
      />

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg border border-white/20 
        shadow-xl flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl"
            >
              ×
            </button>

            <ProductManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <ProductEditModal
          formData={editingProduct}
          onSubmit={handleUpdate}
          closeModal={() => setEditingProduct(null)}
        />
      )}
    </>
  );
};

export default ProductList;
