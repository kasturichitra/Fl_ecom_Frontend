import SearchDropdown from "./SearchDropdown";

export default function UploadXLExcel({
  isOpen,
  setIsOpen,
  modelInputPlaceholder,
  data,
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  handleSelect,
  onFileChange,
  isSubmitting,
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-100 opacity-50" />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Excel by Category</h2>

            {/* Search Dropdown for Category */}
            <div className="mb-4">
              <h2 className="block text-sm font-semibold text-gray-700 mb-2">Select Category</h2>
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
            </div>

            {/* File Upload Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Excel File</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={onFileChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="mt-2 w-full py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
