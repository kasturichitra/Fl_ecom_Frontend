import { useState } from "react";

import { useDeleteBrand, useGetAllBrands } from "../../hooks/useBrand";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/Table";
import BrandEditModal from "./BrandEditModal";
import BrandManager from "./BrandManager";
import { DropdownFilter } from "../../components/DropdownFilter";
import { statusOptions } from "../../lib/constants";
import { useGetAllCategories } from "../../hooks/useCategory";

const BrandListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0); // 0-based page

  const { mutateAsync: deleteBrandMutation } = useDeleteBrand();

  const [caterogyId, setCaterogyId] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  // console.log("activeStatus", activeStatus);

  const statusFun = () => {
    if (activeStatus === "active") return true;
    if (activeStatus === "inactive") return false;

    return undefined; // ⭐ FIX — remove filter
  };

  const { data: categories } = useGetAllCategories();

  let formattedCategories =
    categories?.data?.map((ind) => ({
      label: ind?.category_name,
      value: ind?.category_unique_id,
    })) || [];

  formattedCategories.unshift({
    label: "All Categories",
    value: "",
  });

  const { data: brandsData, isError } = useGetAllBrands({
    searchTerm,
    page: currentPage + 1, // API pages are 1-based
    limit: pageSize,
    is_active: statusFun(),
    category_unique_id: caterogyId,
  });

  // console.log("brandsData", brandsData?.data);
  const data = brandsData?.data || [];

  const columns = [
    {
      field: "brand_unique_id",
      headerName: "BRAND ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 font-medium capitalize",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          {params?.value ?? ""}
        </span>
      ),
    },

    {
      field: "brand_name",
      headerName: "BRAND NAME",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-700 font-semibold capitalize",
      renderCell: (params) => <span className="font-semibold text-gray-800">{params?.value ?? ""}</span>,
    },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      type: "singleSelect", // Enables filter dropdown
      valueOptions: ["Active", "Inactive"], // Shows in filter
      valueGetter: (params) => (params.value ? "Active" : "Inactive"), // Convert boolean → string
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            params.row?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {params.row?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "brand_description",
      headerName: "DESCRIPTION",
      flex: 2,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm tracking-wider text-gray-600",
      renderCell: (params) => {
        const desc = params?.value ?? "";
        return (
          <span className="text-gray-600">
            {desc?.substring(0, 40) || "—"}
            {desc?.length > 40 ? "..." : ""}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      filterable: false,
      width: 150,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 flex gap-1",
      hideable: false,
      disableColumnMenu: true,
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

  const handleEdit = (brand) => {
    setEditingBrand(brand);
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete brand "${brand.brand_name}"?`)) return;
    await deleteBrandMutation(brand.brand_unique_id);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    // refreshBrands();
  };

  const handleCloseEditModal = () => {
    setEditingBrand(null);
    // refreshBrands();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-8xl mx-auto px-4">
        {/* HEADER */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <PageHeader
            title="Brand Manager"
            subtitle="Manage all brands"
            actionLabel="Add New Brand"
            onAction={() => setShowAddModal(true)}
          />

          {/* SEARCH BAR */}
          <div className="px-6 py-4 flex items-center gap-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search industry types..." />
            <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={statusOptions} />
            <DropdownFilter data={formattedCategories} onSelect={(id) => setCaterogyId(id)} />
          </div>

          {/* TABLE */}
          <div className="p-3 bg-white">
            {isError ? (
              <p className="text-red-600">Error loading brands</p>
            ) : (
              <DataTable
                rows={data || []}
                getRowId={(row) => row?.brand_unique_id}
                columns={columns}
                page={currentPage}
                pageSize={pageSize}
                totalCount={brandsData?.totalCount || 0}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
              />
            )}
          </div>
        </div>
      </div>

      {/* ADD BRAND MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseAddModal}
              className="absolute right-4 top-4 text-gray-800 text-4xl hover:text-red-600 transition "
            >
              ×
            </button>
            <BrandManager setShowAddModal={setShowAddModal} onCancel={handleCloseAddModal} />
          </div>
        </div>
      )}

      {/* EDIT BRAND MODAL */}
      {editingBrand && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <BrandEditModal brand={editingBrand} onClose={handleCloseEditModal} setEditingBrand={setEditingBrand} />
        </div>
      )}
    </div>
  );
};

export default BrandListManager;
