import React, { useState } from "react";

export default function DownloadXLExcel({ isOpen, setIsOpen, modelInputPlaceholder, Data, search, setSearch, sugstion, setSuggstion }) {
  console.log(Data, "Data");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-100 opacity-50"
            // onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search</h2>

            {/* Search Input */}
            <div className="relative">
              <div className="z-10">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={modelInputPlaceholder || "Search..."}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Suggestions List */}
              {search && (
                <div className="mt-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white absolute w-full z-20 shadow-lg">
                  {Data && Data?.length > 0 ? (
                    Data?.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                        onClick={() => {
                          setSearch(item?.category_name);
                          // setSuggstion("");
                          // You can close modal or keep it open
                        }}
                      >
                        {item?.category_name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
            {/* Close Button */}
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
