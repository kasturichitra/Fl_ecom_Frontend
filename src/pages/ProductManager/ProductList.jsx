
import { Activity, useCallback, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import BulkProductResultModal from "../../components/BulkProductResultModal.jsx";
import ColumnVisibilitySelector from "../../components/ColumnVisibilitySelector.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import ImportantNotesDialog from "../../components/ImportantNotesDialog.jsx";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import DownloadXLExcel from "../../components/xlDownloadModel.jsx";
import UploadXLExcel from "../../components/xlUploadModel.jsx";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useGetAllIndustries } from "../../hooks/useIndustry.js";
import {
  useCreateBulkProducts,
  useDeleteProduct,
  useDownloadProductExcel,
  useGetAllProducts,
  useUpdateProduct,
} from "../../hooks/useProduct";

import useDebounce from "../../hooks/useDebounce.JS";
import { DEBOUNCED_DELAY, GENDER_OPTIONS } from "../../lib/constants.js";
import { useProductTableHeadersStore } from "../../stores/ProductTableHeaderStore.js";
import { toIndianCurrency } from "../../utils/toIndianCurrency.js";
import ProductEditModal from "./ProductEditModal";
import ProductManager from "./ProductManager";
import useDebounce from "../../hooks/useDebounce.JS";

const ProductList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [excelSearchTerm, setExcelSearchTerm] = useState("");
  const [showExcelDropdown, setShowExcelDropdown] = useState(false);

  // Upload Excel Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSearchTerm, setUploadSearchTerm] = useState("");
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [selectedCategoryForUpload, setSelectedCategoryForUpload] = useState(null);
  const [sort, setSort] = useState("createdAt:desc");
  const [industryId, setIndustryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { productHeaders, updateProductTableHeaders } = useProductTableHeadersStore();

  // Bulk product result modal state
  const [showBulkResultModal, setShowBulkResultModal] = useState(false);
  const [bulkResultData, setBulkResultData] = useState(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const [openNotes, setOpenNotes] = useState(false); // ⬅️ REQUIRED STATE
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const deboouncedSearchTerm = useDebounce(searchTerm, DEBOUNCED_DELAY);

  const {
    data: productsResponse,
    isLoading: loading,
    isError: error,
  } = useGetAllProducts({
    searchTerm: deboouncedSearchTerm,
    industry_unique_id: industryId,
    category_unique_id: categoryId,
    gender: selectedGender,
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
  formattedIndustries?.unshift({
    label: "All Industries",
    value: "",
  });

  const { data: filterCategories } = useGetAllCategories({
    ...(industryId && { industry_unique_id: industryId }),
  });

  let formattedFilterCategories = filterCategories?.data?.map((cat) => ({
    value: cat.category_unique_id,
    label: cat.category_name,
  }));

  // Add "All Categories" option to the start of array using array.unshift method
  formattedFilterCategories?.unshift({
    label: "All Categories",
    value: "",
  });

  const rows = productsResponse?.data || productsResponse || [];
  const totalCount = productsResponse?.totalCount ?? (Array.isArray(rows) ? rows.length : 0);

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutateAsync: downloadExcel } = useDownloadProductExcel({
    onSuccess: () => setIsOpen(false),
  });

  const { mutateAsync: createBulkProducts } = useCreateBulkProducts({
    onSuccess: (response) => {
      setBulkResultData(response?.data?.data);
      setShowBulkResultModal(true);
    },
  });
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: categories } = useGetAllCategories({
    search: excelSearchTerm || uploadSearchTerm,
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

  const handleUploadCategorySelect = (item) => {
    console.log(item);

    setSelectedCategoryForUpload(item);
    setUploadSearchTerm(item.label);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedCategoryForUpload) {
      alert("Please select a category first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category_unique_id", selectedCategoryForUpload.value);

    await createBulkProducts(formData);

    // Reset and close modal
    setIsUploadOpen(false);
    setSelectedCategoryForUpload(null);
    setUploadSearchTerm("");
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
      field: "brand_name",
      headerName: "BRAND",
      flex: 2,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
    },
    {
      field: "category_name",
      headerName: "CATEGORY",
      flex: 2,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
    },
    {
      field: "final_price",
      headerName: "Final Price",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm text-gray-800",
      renderCell: (params) => <span>{toIndianCurrency(params.value)}</span>,
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

  const visibleColumns = columns.filter((col) => {
    const headerConfig = productHeaders.find((h) => h.key === col.headerName);
    return headerConfig ? headerConfig.value : true;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="max-w-8xl">
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
              <div className="flex items-center gap-2">
                <ColumnVisibilitySelector
                  headers={productHeaders}
                  updateTableHeaders={updateProductTableHeaders}
                  dropdownRef={dropdownRef}
                  setIsDropdownOpen={setIsDropdownOpen}
                  isDropdownOpen={isDropdownOpen}
                />
                <DropdownFilter data={formattedIndustries} onSelect={(id) => setIndustryId(id)} />
                <DropdownFilter data={formattedFilterCategories} onSelect={(id) => setCategoryId(id)} />
                <DropdownFilter data={GENDER_OPTIONS} onSelect={(value) => setSelectedGender(value)} />
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setOpenNotes(true)} // ⬅️ UPDATED CLICK HANDLER
                  className="bg-white text-indigo-600 font-bold px-5 py-3 rounded-lg shadow hover:bg-indigo-50 flex items-center gap-2"
                >
                  <FaFileDownload />
                  Download Excel
                </button>

                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-white text-indigo-600 font-bold px-5 py-3 rounded-lg shadow hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                >
                  <FaFileUpload />
                  Upload Excel
                </button>
              </div>
            </div>

            <div className="p-6 bg-white">
              <DataTable
                rows={rows}
                getRowId={(row) => row.product_unique_id}
                columns={visibleColumns}
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

            <Activity mode={error ? "visible" : "hidden"}>
              <div className="mx-6 mb-6 p-5 bg-red-50 border border-red-300 text-red-700 rounded-xl text-center">
                Error loading products.
              </div>
            </Activity>
          </div>
        </div>
      </div>

      {/* {showAddModal && ( */}
      <Activity mode={showAddModal ? "visible" : "hidden"}>
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
      </Activity>

      <Activity mode={editingProduct ? "visible" : "hidden"}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 p-6">
            <button onClick={handleCloseEdit} className="absolute right-4 top-4 text-gray-700 text-3xl">
              ×
            </button>
            <ProductEditModal formData={editingProduct} onSuccess={handleUpdate} closeModal={handleCloseEdit} />
          </div>
        </div>
      </Activity>

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

      <ImportantNotesDialog
        open={openNotes}
        onClose={() => setOpenNotes(false)}
        onProceed={() => {
          setOpenNotes(false);
          setIsOpen(true);
        }}
      />

      <UploadXLExcel
        isOpen={isUploadOpen}
        setIsOpen={setIsUploadOpen}
        modelInputPlaceholder="Search category..."
        data={formattedCategories}
        searchTerm={uploadSearchTerm}
        setSearchTerm={setUploadSearchTerm}
        showDropdown={showUploadDropdown}
        setShowDropdown={setShowUploadDropdown}
        handleSelect={handleUploadCategorySelect}
        onFileChange={handleExcelUpload}
      />

      <Activity mode={showBulkResultModal ? "visible" : "hidden"}>
        <BulkProductResultModal
          open={showBulkResultModal}
          onClose={() => {
            setShowBulkResultModal(false);
            setBulkResultData(null);
          }}
          resultData={bulkResultData}
        />
      </Activity>
    </>
  );
};

export default ProductList;
