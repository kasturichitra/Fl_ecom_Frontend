import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { fetchBrands } from "../../redux/brandSlice";
import { useDeleteBrand, useGetAllBrands } from "../../hooks/useBrand";

import SearchBar from "../../components/SearchBar";
import DynamicTable from "../../components/DynamicTable";
import BrandManager from "./BrandManager";
import BrandEditModal from "./BrandEditModal";

const BrandListManager = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const { mutateAsync: deleteBrandMutation } = useDeleteBrand();

  const token = localStorage.getItem("token");
  const tenantId = "tenant123";

  const refreshBrands = useCallback(() => {
    dispatch(fetchBrands({ token, tenantId }));
  }, [dispatch, token, tenantId]);

  useEffect(() => {
    refreshBrands();
  }, [refreshBrands]);

  const {
    data: brandsData,
    isLoading,
    isError,
  } = useGetAllBrands({ searchTerm });

  const columns = [
    {
      key: "brand_unique_id",
      label: "BRAND ID",
      render: (value) => (
        <span className="font-mono px-3 py-1 bg-purple-100 text-purple-700 rounded-md">
          {value}
        </span>
      ),
    },
    {
      key: "brand_name",
      label: "BRAND NAME",
      render: (value) => (
        <span className="font-semibold text-gray-800 text-lg">{value}</span>
      ),
    },
    {
      key: "brand_description",
      label: "DESCRIPTION",
      render: (value) => (
        <span className="text-gray-600">
          {value?.substring(0, 40) || "—"}
          {value?.length > 40 ? "..." : ""}
        </span>
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
    refreshBrands();
  };

  const handleCloseEditModal = () => {
    setEditingBrand(null);
    refreshBrands();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-8xl mx-auto px-4">

        {/* HEADER */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-7 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold">Brand Management</h1>
              <p className="text-indigo-100 text-lg mt-1">Manage all brands</p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-indigo-600 cursor-pointer font-bold px-6 py-3 
              rounded-lg shadow-lg hover:bg-indigo-50 transition transform hover:scale-105"
            >
              Add New Brand
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="p-6 bg-gray-50 border-b flex justify-center">
            <div className="max-w-md w-full">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search brands..."
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6 bg-white">
            {isError ? (
              <p className="text-red-600">Error loading brands</p>
            ) : (
              <DynamicTable
                data={brandsData?.brands || []}
                columns={columns}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                sortable={true}
                itemsPerPage={10}
                emptyMessage={"No brands found"}
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
      </div>

      {/* ADD BRAND MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseAddModal}
              className="absolute right-4 top-4 text-gray-800 text-3xl"
            >
              ×
            </button>
            <BrandManager onCancel={handleCloseAddModal} />
          </div>
        </div>
      )}

      {/* EDIT BRAND MODAL */}
      {editingBrand && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <BrandEditModal
            brand={editingBrand}
            onClose={handleCloseEditModal}
            setEditingBrand={setEditingBrand}
          />
        </div>
      )}
    </div>
  );
};

export default BrandListManager;
