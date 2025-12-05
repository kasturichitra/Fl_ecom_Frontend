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
