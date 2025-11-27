// src/pages/ProductManager/ProductList.jsx

import { useCallback, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import DownloadXLExcel from "../../components/xlDownloadModel.jsx";
import { useGetAllCategories } from "../../hooks/useCategory";
import {
  useCreateBulkProducts,
  useDeleteProduct,
  useDownloadProductExcel,
  useGetAllProducts,
  useUpdateProduct,
} from "../../hooks/useProduct";
import ProductEditModal from "./ProductEditModal";
import ProductManager from "./ProductManager";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import ImportantNotesDialog from "../../components/ImportantNotesDialog.jsx"; // ⬅️ ADD THIS IMPORT
import { Diameter } from "lucide-react";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import { useGetAllIndustries } from "../../hooks/useIndustry.js";

const ProductList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [excelSearchTerm, setExcelSearchTerm] = useState("");
  const [showExcelDropdown, setShowExcelDropdown] = useState(false);
  const [sort, setSort] = useState("createdAt:desc");
  const [industryId, setIndustryId] = useState("");

  const [openNotes, setOpenNotes] = useState(false); // ⬅️ REQUIRED STATE

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: productsResponse,
    isLoading: loading,
    isError: error,
  } = useGetAllProducts({
    searchTerm,
    industry_unique_id: industryId,
    sort: decodeURIComponent(sort),
    page: currentPage + 1,
    limit: pageSize,
  });

  const { data: industries } = useGetAllIndustries();

  let formattedIndustries = industries?.data?.map((ind) => ({
    value: ind.industry_unique_id,
    label: ind.industry_name,
  }));

  // Add "All Industries" option to the start of array using array.unshitf method
  formattedIndustries.unshift({
    label: "All Industries",
    value: "",
  });

  const rows = productsResponse?.data || productsResponse || [];
  const totalCount = productsResponse?.totalCount ?? (Array.isArray(rows) ? rows.length : 0);

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutateAsync: downloadExcel } = useDownloadProductExcel({
    onSuccess: () => setIsOpen(false),
  });
  const { mutateAsync: createBulkProducts } = useCreateBulkProducts();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: categories } = useGetAllCategories({
    search: excelSearchTerm,
  });

  const formattedCategories = categories?.data?.map((cat) => ({
    value: cat.category_unique_id,
    label: cat.category_name,
  }));

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handleExcelCategorySelect = async (item) => {
    const uniqueId = item.value;
    const response = await downloadExcel({ uniqueId });

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

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await createBulkProducts(formData);
  };

  const handleUpdate = async (formData) => {
    if (!editingProduct) return;
    await updateProduct({
      uniqueId: editingProduct.product_unique_id,
      payload: formData,
    });
  };

  const handleEdit = useCallback((item) => {
    setEditingProduct(item);
  }, []);

  const handleDelete = (targetProduct) => {
    const { product_unique_id } = targetProduct;
    deleteProduct({ uniqueId: product_unique_id });
  };

  const handleCloseEdit = () => setEditingProduct(null);
  const handleCloseAdd = () => setShowAddModal(false);

  const columns = [
    {
      field: "product_unique_id",
      headerName: "PRODUCT ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{params.value}</span>
      ),
    },
    {
      field: "product_name",
      headerName: "NAME",
      flex: 2,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
    },
    {
      field: "price",
      headerName: "PRICE",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-800",
    },
    {
      field: "stock_quantity",
      headerName: "STOCK",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-800",
    },
    {
      field: "min_order_limit",
      headerName: "MOQ",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-800",
    },
    {
      field: "product_color",
      headerName: "COLOR",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-800",
    },
    {
      field: "gender",
      headerName: "GENDER",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-800",
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      width: 140,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 flex gap-1",
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
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
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
            <PageHeader
              title="Product Manager"
              subtitle="Manage all store products"
              actionLabel="Add New Product"
              onAction={() => setShowAddModal(true)}
            />

            <div className="p-6 bg-gray-50 border-b flex items-center justify-between gap-4">
              <div className="max-w-md">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search products..." />
              </div>

              {/*Filters Grid / Filters Column whatever it is */}
              <DropdownFilter data={formattedIndustries} onSelect={(id) => setIndustryId(id)} />

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setOpenNotes(true)} // ⬅️ UPDATED CLICK HANDLER
                  className="bg-white text-indigo-600 font-bold px-5 py-3 rounded-lg shadow hover:bg-indigo-50 flex items-center gap-2"
                >
                  <FaFileDownload />
                  Download Excel
                </button>

                <label
                  htmlFor="excel-upload"
                  className="bg-white text-indigo-600 font-bold px-5 py-3 rounded-lg shadow hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                >
                  <FaFileUpload />
                  Upload Excel
                </label>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleExcelUpload}
                />
              </div>
            </div>

            <div className="p-6 bg-white">
              <DataTable
                rows={rows}
                getRowId={(row) => row.product_unique_id}
                columns={columns}
                page={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                sort={sort}
                setSort={(newSort) => {
                  const sortItem = newSort[0];
                  setSort(sortItem ? `${sortItem.field}:${sortItem.sort}` : "");
                }}
              />
            </div>

            {error && (
              <div className="mx-6 mb-6 p-5 bg-red-50 border border-red-300 text-red-700 rounded-xl text-center">
                Error loading products.
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={handleCloseAdd}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl"
            >
              ×
            </button>
            <ProductManager onCancel={handleCloseAdd} />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 p-6">
            <button onClick={handleCloseEdit} className="absolute right-4 top-4 text-gray-700 text-3xl">
              ×
            </button>
            <ProductEditModal formData={editingProduct} onSuccess={handleUpdate} closeModal={handleCloseEdit} />
          </div>
        </div>
      )}

      <DownloadXLExcel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modelInputPlaceholder="Search products name"
        data={formattedCategories}
        searchTerm={excelSearchTerm}
        setSearchTerm={setExcelSearchTerm}
        showDropdown={showExcelDropdown}
        setShowDropdown={setShowExcelDropdown}
        handleSelect={handleExcelCategorySelect}
      />

      {/* ⬇️ REQUIRED: IMPORTANT EXCEL NOTES POPUP */}
      <ImportantNotesDialog
        open={openNotes}
        onClose={() => setOpenNotes(false)}
        onProceed={() => {
          setOpenNotes(false);
          setIsOpen(true);
        }}
      />
    </>
  );
};

export default ProductList;
