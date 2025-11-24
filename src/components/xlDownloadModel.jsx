import { useState } from "react";
import SearchDropdown from "./SearchDropdown";

export default function DownloadXLExcel({
  isOpen,
  setIsOpen,
  modelInputPlaceholder,
  data,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

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

            <SearchDropdown
              
            />
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
