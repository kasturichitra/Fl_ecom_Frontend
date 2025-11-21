// src/components/DynamicTable.jsx
import React, { useState, useMemo } from "react";
import ActionButtons from "./ActionButtons";
import PaginationControls from "./PaginationControls"; // ← ADDED

const DynamicTable = ({
  data = [],
  columns = [],
  excludeColumns = [],
  itemsPerPage = 10,
  sortable = false,
  loading = false,
  emptyMessage,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(0); // ← react-paginate uses 0-based index
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const filteredColumns = columns.filter(
    (col) => !excludeColumns.includes(col.key)
  );

  // const sortedData = useMemo(() => {
  //   if (!sortable || !sortConfig.key) return data;
  //   const sorted = [...data].sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
  //     if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
  //     return 0;
  //   });
  //   return sorted;
  // }, [data, sortConfig, sortable]);

  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return data?.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return emptyMessage || <p className="text-center text-gray-500 py-12">No data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            {filteredColumns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`px-6 py-4 text-left text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition ${
                  sortable ? "select-none" : ""
                }`}
              >
                {col.label || col.key}
                {sortable && sortConfig.key === col.key && (
                  <span className="ml-2">{sortConfig.direction === "asc" ? "Up" : "Down"}</span>
                )}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              {filteredColumns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {col.render ? col.render(row[col.key], row) : row[col.key] || "-"}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-center">
                  <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ONLY CHANGE: Using your PaginationControls component */}
      {pageCount > 0 && (
        <PaginationControls
          pageCount={pageCount}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default DynamicTable;