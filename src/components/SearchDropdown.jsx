import React, { useState, useRef, useEffect } from "react";

const SearchDropdown = ({
  value,
  placeholder,
  results = [],
  onChange,
  onSearch,
  onSelect,
  clearResults,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef([]);

  // Reset highlight when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        const item = results[highlightedIndex];
        onChange(item.label);
        if (onSelect) onSelect(item);
        if (clearResults) clearResults();
      }
    } else if (e.key === "Escape") {
      if (clearResults) clearResults();
    }
  };

  const handleItemClick = (item) => {
    onChange(item.label);
    if (onSelect) onSelect(item);
    if (clearResults) clearResults();
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder || "Search..."}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val);
          if (onSearch) onSearch(val);
        }}
        onKeyDown={handleKeyDown}
        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute mt-1 left-0 right-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
          {results.map((item, index) => (
            <div
              key={item.value}
              ref={(el) => (resultsRef.current[index] = el)}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`p-3 cursor-pointer transition ${
                highlightedIndex === index
                  ? "bg-indigo-100 text-indigo-800 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;