import { useCallback, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import HeaderTitles from "../../components/Header.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import DataTable from "../../components/Table.jsx";
import { useDeleteIndustry, useGetAllIndustries, useUpdateIndustry } from "../../hooks/useIndustry";
import IndustryTypeEditModal from "./IndustryTypeEditModal";
import IndustryTypeManager from "./IndustryTypeManager";

const IndustryTypeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: industryTypes,
    isLoading: loading,
    isError: error,
  } = useGetAllIndustries({
    search: debouncedSearchTerm,
    page: currentPage + 1,
    limit: pageSize,
  });

  console.log(currentPage,'current page number');
  console.log(pageSize,'page size is here');
  

  const { mutateAsync: updateIndustry, isPending: isUpdating } = useUpdateIndustry({
    onSettled: () => setEditingIndustry(false),
  });

  const { mutateAsync: deleteIndustry } = useDeleteIndustry();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // reset to first page when search changes
    }, 500);

    return () => clearTimeout(handler); // cleanup timeout if searchTerm changes
  }, [searchTerm]);

  const handleUpdate = async (formData) => {
    if (!editingIndustry) return;
    await updateIndustry({
      id: editingIndustry.industry_unique_id,
      data: formData,
    });
  };

  const handleEdit = useCallback((item) => {
    setEditingIndustry(item);
  }, []);

  const handleDelete = useCallback(async (item) => {
    if (window.confirm(`Delete ${item.industry_name}?`)) {
      await deleteIndustry(item.industry_unique_id);
    }
  }, []);

  // const columns = [
  //   {
  //     key: "industry_unique_id",
  //     label: "UNIQUE ID",
  //     render: (value) => (
  //       <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{value}</span>
  //     ),
  //   },
  //   {
  //     key: "industry_name",
  //     label: "INDUSTRY NAME",
  //     render: (value) => <span className="font-semibold">{value}</span>,
  //   },
  //   {
  //     key: "is_active",
  //     label: "STATUS",
  //     render: (value) => (
  //       <span
  //         className={`px-3 py-1 rounded-full text-xs font-bold ${
  //           value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  //         }`}
  //       >
  //         {value ? "Active" : "Inactive"}
  //       </span>
  //     ),
  //   },
  // ];

  const columns = [
    {
      field: "industry_unique_id",
      headerName: "UNIQUE ID",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize font-bold",
      renderCell: (params) => (
        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{params.value}</span>
      ),
    },
    {
      field: "industry_name",
      headerName: "INDUSTRY NAME",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
      renderCell: (params) => <span className="font-semibold">{params.value}</span>,
    },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 capitalize",
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            params.value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "ACTIONS",
      sortable: false,
      filterable: false,
      width: 150,
      headerClassName: "custom-header",
      cellClassName: "px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 flex gap-1",
      renderCell: (params) => (
        <div className="flex gap-2 align-center">
          <button size="small" onClick={() => handleEdit(params.row)} className="cursor-pointer ">
            <FaEdit size={18} className="text-[#4f46e5]" />
          </button>

          <button size="small" onClick={() => handleDelete(params.row)}>
            <MdDelete size={18} className="text-[#4f46e5]" />
          </button>
        </div>
      ),
    },
  ];

 // When page size changes, always fetch the first page with new size
const handlePageSizeChange = (newPageSize) => {
  setPageSize(newPageSize);
  setCurrentPage(0); // Always go back to first page when changing page size
};

const handlePageChange = (newPage) => {
  setCurrentPage(newPage); // Allow normal pagination
};

  return (
    <>
      <div className="flex flex-col gap-y-4 border border-gray-300 rounded-lg p-4 height-full">
        <HeaderTitles
          title="Industry Types"
          subtitle="Manage all industry classifications"
          buttonLabel="Add New Industry"
          onHandelClick={() => setShowAddModal(true)}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search industry types..." />
        <DataTable
          rows={industryTypes?.data || []}
          getRowId={(row) => row.industry_unique_id}
          columns={columns}
          page={currentPage}
          pageSize={pageSize}
          totalCount={industryTypes?.totalCount || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

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

{
  /* <PageLayoutWithTable
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
      /> */
}
