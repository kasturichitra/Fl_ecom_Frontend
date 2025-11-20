// src/components/common/SearchBar.jsx
import React from "react";
import { Search, X } from "lucide-react"; // Make sure you have lucide-react installed

const SearchBar = ({
  searchTerm = "",
  onSearchChange,
  placeholder = "Search...",
  className = "",
}) => {
  const hasValue = searchTerm.trim().length > 0;

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-12 py-3 
          text-gray-800 placeholder-gray-500
          bg-white border border-gray-300 
          rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          text-base
        `}
      />

      {/* Clear Button */}
      {hasValue && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
          aria-label="Clear search"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;