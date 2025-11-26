import { useState } from "react";
import SearchDropdown from "./SearchDropdown";

export default function DownloadXLExcel({
  isOpen,
  setIsOpen,
  modelInputPlaceholder,
  data,
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  handleSelect, 
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-100 opacity-50" />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Download by Category</h2>

            <SearchDropdown
              value={searchTerm}
              placeholder={modelInputPlaceholder || "Search category..."}
              results={showDropdown ? data : []}
              onChange={(val) => {
                setSearchTerm(val);
                setShowDropdown(true);
              }}
              onSearch={(val) => {
                setSearchTerm(val);
                setShowDropdown(true);
              }}
              onSelect={(item) => {
                handleSelect(item);
                setShowDropdown(false);
              }}
              clearResults={() => {
                setSearchTerm("");
                setShowDropdown(false);
              }}
            />

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
