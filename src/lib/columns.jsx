import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const notificationColumns = [
  {
    field: "message",
    headerName: "MESSAGE",
    flex: 1,
    renderCell: (params) => <span className="font-semibold text-gray-800">{params.value}</span>,
  },
  {
    field: "updatedAt",
    headerName: "CREATED AT",
    flex: 1,
    valueGetter: (params) => new Date(params?.row?.createdAt)?.toLocaleString(),
    renderCell: (params) => <span className="text-gray-600">{new Date(params?.row?.createdAt)?.toLocaleString()}</span>,
  },
];

export const industryTypeColumns = [
  {
    field: "industry_unique_id",
    headerName: "UNIQUE ID",
    flex: 1,
    renderCell: (params) => (
      <span className="font-mono text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{params.value}</span>
    ),
  },
  {
    field: "industry_name",
    headerName: "INDUSTRY NAME",
    flex: 1,
    renderCell: (params) => <span className="font-semibold text-gray-800">{params.value}</span>,
  },
  {
    field: "is_active",
    headerName: "STATUS",
    flex: 1,
    valueGetter: (params) => (params.value ? "Active" : "Inactive"),
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
  {
    field: "actions",
    headerName: "ACTIONS",
    width: 120,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <div className="flex gap-3 items-center">
        <button
          onClick={() => handleEdit(params.row)}
          className="text-indigo-600 hover:text-indigo-800 transition"
          title="Edit"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => handleDelete(params.row)}
          className="text-indigo-600 hover:text-indigo-800 transition"
          title="Delete"
        >
          <MdDelete size={18} />
        </button>
      </div>
    ),
  },
];
