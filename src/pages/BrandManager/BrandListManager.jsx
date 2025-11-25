import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { fetchBrands } from "../../redux/brandSlice";
import { useDeleteBrand, useGetAllBrands } from "../../hooks/useBrand";

import SearchBar from "../../components/SearchBar";
import DynamicTable from "../../components/DynamicTable";
import BrandManager from "./BrandManager";
import BrandEditModal from "./BrandEditModal";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/Table";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const BrandListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0); // 0-based page

  const { mutateAsync: deleteBrandMutation } = useDeleteBrand();

  const token = localStorage.getItem("token");
  const tenantId = "tenant123";

  const { data, isLoading, isError } = useGetAllBrands({
    searchTerm,
    page: currentPage + 1, // API pages are 1-based
    limit: pageSize,
  });

  console.log("brandsData", data);

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
          <div className="p-6 bg-gray-50 border-b flex justify-start px-5">
            <div className="max-w-md w-full">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search brands..." />
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6 bg-white">
            {isError ? (
              <p className="text-red-600">Error loading brands</p>
            ) : (
              // <DynamicTable
              //   data={brandsData || []}
              //   columns={columns}
              //   loading={isLoading}
              //   onEdit={handleEdit}
              //   onDelete={handleDelete}
              //   sortable={true}
              //   itemsPerPage={10}
              //   emptyMessage={"No brands found"}
              //   excludeColumns={["_id", "__v", "tenant_id", "createdAt", "updatedAt", "created_by", "updated_by"]}
              // />

              // <DataTable
              //   rows={industryTypes?.data || []}
              //   getRowId={(row) => row.industry_unique_id}
              //   columns={columns}
              //   page={currentPage}
              //   pageSize={pageSize}
              //   totalCount={industryTypes?.totalCount || 0}
              //   setCurrentPage={setCurrentPage}
              //   setPageSize={setPageSize}
              // />

              <DataTable
                rows={data?.brands || []}
                getRowId={(row) => row.brand_unique_id}
                columns={columns}
                page={currentPage}
                pageSize={pageSize}
                totalCount={data?.totalCount || 0}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
              />
            )}
          </div>
        </div>
      </div>

      {/* ADD BRAND MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full relative">
            <button onClick={handleCloseAddModal} className="absolute right-4 top-4 text-gray-800 text-3xl">
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
