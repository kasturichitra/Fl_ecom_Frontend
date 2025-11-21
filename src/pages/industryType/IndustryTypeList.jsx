import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteIndustryType, fetchIndustryTypes, updateIndustryType } from "../../redux/industryTypeSlice";

import PageLayoutWithTable from "../../components/PageLayoutWithTable";
import { useDeleteIndustry, useGetAllIndustries, useUpdateIndustry } from "../../hooks/useIndustry";
import IndustryTypeEditModal from "./IndustryTypeEditModal";
import IndustryTypeManager from "./IndustryTypeManager";

const IndustryTypeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { items: industryTypes, loading, error } = useSelector(
  //   (state) => state.industryTypes
  // );

  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: industryTypes,
    isLoading: loading,
    isError: error,
  } = useGetAllIndustries({
    search: searchTerm,
  });
  const { mutateAsync: updateIndustry, isPending: isUpdating } = useUpdateIndustry();
  const { mutateAsync: deleteIndustry } = useDeleteIndustry();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  // const [isUpdating, setIsUpdating] = useState(false);

  const token = "your-token";
  const tenantId = "tenant123";

  const handleUpdate = async (formData) => {
    if (!editingIndustry) return;
    // setIsUpdating(true);
    await updateIndustry(editingIndustry.industry_unique_id, formData);
  };
  const handleEdit = useCallback((item) => {
    setEditingIndustry(item);
  }, []);

  const handleDelete = useCallback(
    async (item) => {
      if (window.confirm(`Delete ${item.industry_name}?`)) {
        await deleteIndustry(item.industry_unique_id);
      }
    },
    [dispatch]
  );

  const columns = [
    {
      key: "industry_unique_id",
      label: "UNIQUE ID",
      render: (value) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{value}</span>
      ),
    },
    {
      key: "industry_name",
      label: "INDUSTRY NAME",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "is_active",
      label: "STATUS",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
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
        title="Industry Types Manager"
        subtitle="Manage all industry classifications"
        buttonLabel="Add New Industry"
        onAddClick={() => setShowAddModal(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tableData={industryTypes}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        error={error}
        itemsPerPage={8}
        excludeColumns={["_id", "__v", "tenant_id", "createdAt", "updatedAt", "created_by", "updated_by"]}
        emptyMessage={<div className="text-center py-10 text-gray-500">No industry types found.</div>}
      />

      {showAddModal && (
        <div
          className="fixed inset-0 glass-container:
bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg
 bg-opacity-60 bg-opacity-40 flex items-center justify-center x-60 z-50"
        >
          <div className="">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-gray-700 hover:text-red-600 text-3xl"
            >
              ×
            </button>

            <IndustryTypeManager onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingIndustry && (
        <IndustryTypeEditModal
          formData={editingIndustry}
          // setFormData={setEditingIndustry}
          onSubmit={handleUpdate}
          closeModal={() => setEditingIndustry(null)}
        />
      )}
    </>
  );
};

export default IndustryTypeList;
