import React from "react";
import ReactPaginate from "react-paginate";

const PaginationControls = ({ pageCount, onPageChange, currentPage }) => {
  if (pageCount <= 1) return null; // Hide pagination if only 1 page

  return (
    <div className="flex justify-center mt-4">
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        pageCount={pageCount}
        forcePage={currentPage} // 0-based index
        onPageChange={onPageChange}
        pageRangeDisplayed={1} // Show 3 page numbers in the middle (e.g., 45,46,47)
        marginPagesDisplayed={1} // Always show first 2 and last 2 pages (1,2 ... 99,100)
        containerClassName="flex items-center space-x-1"
        pageClassName="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer transition"
        pageLinkClassName="w-full h-full flex items-center justify-center"
        activeClassName="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
        previousClassName="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer transition"
        nextClassName="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer transition"
        breakClassName="px-3 py-2"
        disabledClassName="opacity-50 cursor-not-allowed"
        disabledLinkClassName="cursor-not-allowed"
      />
    </div>
  );
};

export default PaginationControls;
