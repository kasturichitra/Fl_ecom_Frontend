import { Activity, useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import DataTable from "../../components/Table.jsx";
import { DropdownFilter } from "../../components/DropdownFilter.jsx";
import { statusOptions } from "../../lib/constants.js";
import { useGetAllSaleTrends } from "../../hooks/useSaleTrend.js";
import formatDate from "../../utils/formatDate.js";
import { useNavigate } from "react-router-dom";
import SaleTrendsManager from "./SaleTrendsManager.jsx";

const SaleTrends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState("createdAt:desc");
  const [activeStatus, setActiveStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const { data: saleTrendsData } = useGetAllSaleTrends({
    searchTerm,
    page: currentPage + 1,
    limit: pageSize,
    sort,
  });

  console.log("saleTrendsData", saleTrendsData);

  // Dummy Data
  //   const dummyData = [
  //     {
  //       id: 1,
  //       trend_name: "Summer Splash",
  //       trend_from: "2024-06-01",
  //       trend_to: "2024-08-31",
  //       trend_products: "Swimwear, Sunglasses, Beach Towels",
  //       is_active: true,
  //     },
  //     {
  //       id: 2,
  //       trend_name: "Winter Warmers",
  //       trend_from: "2024-11-01",
  //       trend_to: "2025-02-28",
  //       trend_products: "Jackets, Scarves, Gloves",
  //       is_active: true,
  //     },
  //     {
  //       id: 3,
  //       trend_name: "Back to School",
  //       trend_from: "2024-08-15",
  //       trend_to: "2024-09-15",
  //       trend_products: "Backpacks, Notebooks, Pens",
  //       is_active: false,
  //     },
  //     {
  //       id: 4,
  //       trend_name: "Spring Fling",
  //       trend_from: "2024-03-01",
  //       trend_to: "2024-05-31",
  //       trend_products: "Floral Dresses, Light Jackets",
  //       is_active: true,
  //     },
  //     {
  //       id: 5,
  //       trend_name: "Holiday Special",
  //       trend_from: "2024-12-01",
  //       trend_to: "2024-12-25",
  //       trend_products: "Gift Sets, Decorations",
  //       is_active: false,
  //     },
  //   ];

  const columns = [
    {
      field: "trend_name",
      headerName: "TREND NAME",
      flex: 1,
      renderCell: (params) => <span className="font-semibold text-gray-800">{params.value}</span>,
    },
    {
      field: "trend_from",
      headerName: "FROM",
      flex: 1,
      renderCell: (params) => <span className="text-gray-600">{params.value}</span>,
    },
    {
      field: "trend_to",
      headerName: "TO",
      flex: 1,
      renderCell: (params) => <span className="text-gray-600">{params.value}</span>,
    },
    // {
    //   field: "trend_products",
    //   headerName: "PRODUCTS",
    //   flex: 2,
    //   renderCell: (params) => <span className="text-gray-600">{params.value}</span>,
    // },
    {
      field: "is_active",
      headerName: "STATUS",
      flex: 1,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            params.row.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {params.row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const tableData = saleTrendsData?.data?.map((item) => ({
    ...item,
    trend_from: formatDate(item.trend_from),
    trend_to: formatDate(item.trend_to),
  }));

  const handleRowClick = (params) => {
    const trend_unique_id = params.row.trend_unique_id;
    navigate(`/saleTrends/${trend_unique_id}`);
  };

  // Filtering logic for dummy data
  //   const filteredData = dummyData.filter((item) => {
  //     const matchesSearch = item.trend_name.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesStatus = activeStatus === "" ? true : activeStatus === "active" ? item.is_active : !item.is_active;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-8xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <PageHeader
            title="Sale Trends"
            subtitle="Manage sale trends and products"
            actionLabel="Add New Trend"
            onAction={() => setShowModal(true)}
          />

          {/* Filters Row */}
          <div className="p-6 flex flex-wrap items-center gap-4 bg-gray-50 border-b">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search trends..." />
            {/* ColumnVisibilitySelector removed for simplicity as there is no store, but layout preserved */}
            <DropdownFilter value={activeStatus} onSelect={setActiveStatus} data={statusOptions} placeholder="Status" />
          </div>

          {/* Table */}
          <div className="p-6 bg-white">
            <DataTable
              rows={tableData}
              getRowId={(row) => row?._id}
              columns={columns}
              page={currentPage}
              pageSize={pageSize}
              //   totalCount={filteredData.length}
              setCurrentPage={setCurrentPage}
              onRowClick={handleRowClick}
              setPageSize={setPageSize}
              sort={sort}
              setSort={(newSort) => {
                const sortItem = newSort[0];
                setSort(sortItem ? `${sortItem.field}:${sortItem.sort}` : "");
              }}
            />
          </div>
        </div>

        {/* Add Modal */}
        <Activity mode={showModal ? "visible" : "hidden"}>
          <div className="fixed inset-0 bg-white/20 backdrop-blur-lg flex items-center justify-center z-50">
            <SaleTrendsManager onCancel={() => setShowModal(false)} />
          </div>
        </Activity>
      </div>
    </div>
  );
};

export default SaleTrends;
