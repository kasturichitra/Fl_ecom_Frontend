// src/components/BrandListManager.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBrands,
  deleteBrand,
} from "../../redux/brandSlice";

import PageLayoutWithTable from "../../components/PageLayoutWithTable";
import BrandManager from "./BrandManager";
import BrandEditModal from "./BrandEditModal";
import { useGetAllBrands } from "../../hooks/useBrand";

const BrandListManager = () => {
  const dispatch = useDispatch();


  // const { items, loading, error } = useSelector((state) => state.brands);
  // const categories = useSelector((state) => state.categories?.items || []);





  // const brands =
  //   Array.isArray(items) &&
  //   items.length > 0 &&
  //   Array.isArray(items[0].brands)
  //     ? items[0].brands
  //     : [];

  // console.log(brands,"brands")    

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const token = localStorage.getItem("token");
  const tenantId = "tenant123";

  const refreshBrands = useCallback(() => {
    dispatch(fetchBrands({ token, tenantId }));
  }, [dispatch, token, tenantId]);

  useEffect(() => {
    refreshBrands();
  }, [refreshBrands]);


  // const filteredBrands = brands.filter((brand) =>
  //   (brand?.brand_name || "")
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // );


  const {
    data: brandsData,
    isLoading: loading,
    isError: error,
  } = useGetAllBrands({
    searchTerm
  })


  const handleEdit = (brand) => {
    setEditingBrand(brand);
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete brand "${brand.brand_name}"?`)) return;

    await dispatch(
      deleteBrand({
        uniqueId: brand.brand_unique_id,
        token,
        tenantId,
      })
    );

    refreshBrands();
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    refreshBrands();
  };

  const handleCloseEditModal = () => {
    setEditingBrand(null);
    refreshBrands();
  };


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

  console.log("brands Data",brandsData)


  return (
    <>
      <PageLayoutWithTable
        title="Brand Management"
        subtitle="Manage all brands for your system"
        buttonLabel="Add New Brand"
        onAddClick={() => setShowAddModal(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tableData={brandsData?.brands}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        error={error}
        emptyMessage="No brands found"
        excludeColumns={[
          "_id",
          "__v",
          "tenant_id",
          "createdAt",
          "updatedAt",
          "created_by",
          "updated_by",
        ]}
        itemsPerPage={10}
      />

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed glass-container:
bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg
 bg-opacity-60 inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseAddModal}
              className="absolute right-4 top-4 text-gray-800 text-3xl leading-none"
            >
              ×
            </button>
            <BrandManager onCancel={handleCloseAddModal} />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingBrand && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseEditModal}
              className="absolute right-4 top-4 text-gray-800 text-3xl leading-none"
            >
              ×
            </button>
            <BrandEditModal brand={editingBrand} onClose={handleCloseEditModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default BrandListManager;
