import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import PaginationControls from "./PaginationControls";

export default function DataTable({
  rows,
  columns,
  getRowId,
  page,
  pageSize,
  totalCount,
  setCurrentPage,
  setPageSize,
  sort,
  setSort,
}) {
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page
  };

  return (
    <Paper sx={{ maxHeight: 700, width: "100%", display: "flex", flexDirection: "column" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        autoHeight={false} // Important when using fixed height
        disableRowSelectionOnClick
        sortingMode="server"
        sortModel={
          sort
            ? [
                {
                  field: sort.split(":")[0],
                  sort: sort.split(":")[1],
                },
              ]
            : []
        }
        onSortModelChange={setSort}
        // Completely disable MUI's internal pagination
        pagination={false} // This is the key!
        hideFooter={true}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#4f46e5",
            color: "black",
            fontWeight: "bold",
            fontSize: 14,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          flex: 1,
        }}
      />

      {/* Custom Footer */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 75, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>
            {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
          </span>
        </div>

        <PaginationControls
          pageCount={pageCount}
          currentPage={page}
          onPageChange={({ selected }) => setCurrentPage(selected)}
        />
      </div>
    </Paper>
  );
}
