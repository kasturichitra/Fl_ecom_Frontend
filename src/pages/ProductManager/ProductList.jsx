// src/pages/ProductManager/ProductList.jsx

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchProducts, updateProduct } from "../../redux/productSlice";

import PageLayoutWithTable from "../../components/PageLayoutWithTable";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useDeleteProduct, useGetAllProducts } from "../../hooks/useProduct";
import ProductEditModal from "./ProductEditModal";
import ProductManager from "./ProductManager";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState(""); // this only search xl download model search
  // const [sugstion,setSuggstion]=useState("")
  const {
    data: products,
    isLoading: loading,
    isError: error,
  } = useGetAllProducts({
    searchTerm,
  });
  const { data: categories } = useGetAllCategories({ search: search });

    const formattedCategories = categories?.map((i) => ({
    label: `${i.category_name}`,
    value: i.category_unique_id,
  }));

  
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleDelete = (targetProduct) => {
    const { product_unique_id } = targetProduct;
    deleteProduct({ uniqueId: product_unique_id });
  };

  const DownloadHandler = () => {
    setIsOpen((prev) => !prev);
  };

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
    },
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
        tableData={products}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        error={error}
        itemsPerPage={8}
        pathname={pathname}
        DownloadHandler={DownloadHandler}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formattedCategories={formattedCategories}
        setSearch={setSearch}
        search={search}
        modelInputPlaceholder="Search products name"
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
        emptyMessage={<div className="text-center py-10 text-gray-500">No products found.</div>}
      />

      {/* ADD MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-lg border border-white/20 
        shadow-xl flex items-center justify-center z-50"
        >
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
