import React from "react";
import ReactPaginate from "react-paginate";

const PaginationControls = ({ pageCount, onPageChange, currentPage }) => {
  return (
    <div className="flex justify-center mt-4">
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={pageCount}
        forcePage={pageCount > 0 ? currentPage : undefined}
        onPageChange={onPageChange}
        containerClassName={"flex space-x-2"}
        pageClassName={"px-3 py-1 border rounded"}
        activeClassName={"bg-blue-500 text-white"}
        previousClassName={"px-3 py-1 border rounded"}
        nextClassName={"px-3 py-1 border rounded"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );
};

export default PaginationControls;
