import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import DynamicTable from "./DynamicTable";
import SearchBar from "./SearchBar";
import DownloadXLExcel from "./xlDownloadModel.jsx";

const PageLayoutWithTable = ({
  title,
  subtitle,
  buttonLabel,
  onAddClick,

  searchTerm,
  setSearchTerm,

  tableData,
  columns,
  loading,
  onEdit,
  onDelete,

  error,
  emptyMessage,
  excludeColumns,
  itemsPerPage,
  pathname,
  DownloadHandler,
  handleExcelUpload, 
  isOpen,
  setIsOpen,
  modelInputPlaceholder,
  excelDropdownData,
  excelSearchTerm,
  setExcelSearchTerm,
  showExcelDropdown,
  setShowExcelDropdown,
  handleExcelCategorySelect,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-0">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white px-8 py-7 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold">{title}</h1>
              {subtitle && <p className="text-indigo-100 text-lg mt-1">{subtitle}</p>}
            </div>

            <button
              onClick={onAddClick}
              className="bg-white text-indigo-600 cursor-pointer font-bold px-6 py-3 
              rounded-lg shadow-lg hover:bg-indigo-50 transition 
              transform hover:scale-105 flex items-center gap-2"
            >
              {buttonLabel}
            </button>
          </div>

          {/* Search */}
          <div className="p-6 bg-gray-50 border-b flex">
            <div className="max-w-md mx-auto">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search..." />
            </div>
            {pathname === "/productList" && (
              <div className="flex gap-2 items-center">
                <button
                  className="bg-white text-indigo-600 cursor-pointer font-bold px-6 py-3 
              rounded-lg shadow-lg hover:bg-indigo-50 transition 
              transform hover:scale-105 flex items-center gap-2"
                  onClick={DownloadHandler}
                >
                  <FaFileDownload />
                  Download Excel
                </button>
                {/* New functionality I want to add */}
                {/* <button
                  className="bg-white text-indigo-600 cursor-pointer font-bold px-6 py-3 
              rounded-lg shadow-lg hover:bg-indigo-50 transition 
              transform hover:scale-105 flex items-center gap-2"
                >
                  <input type="file" />
                  <FaFileUpload />
                  Upload Excel
                </button> */}

                {/* Upload Excel */}
                <div>
                  <label
                    htmlFor="excel-upload"
                    className="bg-white text-indigo-600 cursor-pointer font-bold px-6 py-3 
      rounded-lg shadow-lg hover:bg-indigo-50 transition transform hover:scale-105 
      flex items-center gap-2"
                  >
                    <FaFileUpload />
                    Upload Excel
                  </label>

                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleExcelUpload}
                  />
                </div>
              </div>
            )}
            {pathname === "/productList" && (
              <div className="ml-4">
                <DownloadXLExcel
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  modelInputPlaceholder={modelInputPlaceholder}
                  data={excelDropdownData}
                  searchTerm={excelSearchTerm}
                  setSearchTerm={setExcelSearchTerm}
                  showDropdown={showExcelDropdown}
                  setShowDropdown={setShowExcelDropdown}
                  handleSelect={handleExcelCategorySelect}
                />
              </div>
            )}
          </div>

          {/* Table */}
          <div className="p-6 bg-white">
            <DynamicTable
              data={tableData}
              columns={columns}
              loading={loading}
              onEdit={onEdit}
              onDelete={onDelete}
              emptyMessage={emptyMessage}
              sortable={true}
              itemsPerPage={itemsPerPage}
              excludeColumns={excludeColumns}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="mx-6 mb-6 p-5 bg-red-50 border border-red-300 
            text-red-700 rounded-xl text-center"
            >
              Error: {error?.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageLayoutWithTable;
