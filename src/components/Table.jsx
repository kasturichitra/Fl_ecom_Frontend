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
  onRowClick,
  pathname,
}) {
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  return (
    <Paper
      sx={{
        maxHeight: 700,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Scrollbar styles (VISIBLE like screenshot) */}
      <style>{`
        .table-scroll {
          overflow-x: auto;
          overflow-y: hidden;
        }

        .table-scroll::-webkit-scrollbar {
          height: 12px;
        }

        .table-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .table-scroll::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 6px;
          border: 2px solid #f1f5f9;
        }

        .table-scroll::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>

      {/* Table Wrapper */}
      <div className="w-full flex-1 table-scroll pb-1">
        <div className="min-w-[1000px] h-full">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            autoHeight={false}
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
            onRowClick={onRowClick}
            pagination={false}
            hideFooter
            sx={{
              ...(pathname === "/order" && {
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },
              }),
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
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Custom Footer */}
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center p-4 border-t bg-gray-50">
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
            {page * pageSize + 1} -{" "}
            {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
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
