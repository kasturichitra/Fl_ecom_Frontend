// src/components/Table.jsx
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function DataTable({
  rows,
  columns,
  getRowId,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <Paper sx={{ maxHeight: 700, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={totalCount || 0}
        page={page} // 0-based page
        pageSize={pageSize}
        // onPageChange={onPageChange} // DataGrid gives 0-based index
        // onPageSizeChange={onPageSizeChange}
        onPageChange={(newPage) => onPageChange(newPage)}
        onPageSizeChange={(params) => onPageSizeChange(params.pageSize)}
        getRowId={getRowId}
        rowsPerPageOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
        
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#4f46e5 !important",
            color: "black",
            fontWeight: "bold",
            fontSize: 14,
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-iconSeparator": {
            display: "none", // remove column separator if you want
          },
        }}
      />
    </Paper>
  );
}
