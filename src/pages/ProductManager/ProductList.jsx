// src/pages/ProductManager/ProductList.jsx

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchProducts, updateProduct } from "../../redux/productSlice";

import PageLayoutWithTable from "../../components/PageLayoutWithTable";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useDeleteProduct, useDownloadProductExcel, useGetAllProducts, useUpdateProduct } from "../../hooks/useProduct";
import ProductEditModal from "./ProductEditModal";
import ProductManager from "./ProductManager";

const ProductList = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [excelSearchTerm, setExcelSearchTerm] = useState("");
  const [showExcelDropdown, setShowExcelDropdown] = useState(false);
  // const [sugstion,setSuggstion]=useState("")
  const {
    data: products,
    isLoading: loading,
    isError: error,
  } = useGetAllProducts({
    searchTerm,
  });

  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: categories } = useGetAllCategories({
    search: excelSearchTerm,
  });

  // Format as { value: id, label: name } for the select dropdown component
  const formattedCategories = categories?.map((cat) => ({
    value: cat.category_unique_id,
    label: cat.category_name,
  }));

  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } = useUpdateProduct({
    onSettled: () => {
      setEditingProduct(null);
    },
  });
  const { mutateAsync: downloadExcel } = useDownloadProductExcel();

  const handleExcelCategorySelect = async (item) => {
    const uniqueId = item.value;
    const response = await downloadExcel({ uniqueId });

    // console.log("Excel data:", data);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "products.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // UPDATE handler
  const handleUpdate = async (formData) => {
    if (!editingProduct) return;

    await updateProduct({
      id: editingProduct.product_unique_id,
      data: formData,
    });
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
        excelDropdownData={formattedCategories}
        excelSearchTerm={excelSearchTerm}
        setExcelSearchTerm={setExcelSearchTerm}
        showExcelDropdown={showExcelDropdown}
        setShowExcelDropdown={setShowExcelDropdown}
        handleExcelCategorySelect={handleExcelCategorySelect}
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
