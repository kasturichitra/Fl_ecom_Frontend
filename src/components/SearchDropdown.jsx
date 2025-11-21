const SearchDropdown = ({ value, placeholder, results = [], onChange, onSearch, onSelect, clearResults }) => {
  return (
    <div className="relative">
      {/* ⭐ Search Input */}
      <input
        type="text"
        value={value}
        placeholder={placeholder || "Search..."}
        onChange={(e) => {
          const val = e.target.value;

          onChange(val); // update formData
          if (onSearch) onSearch(val); // trigger API search
        }}
        className="border p-3 rounded-lg w-full"
      />

      {/* ⭐ Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute mt-1 left-0 right-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
          {results.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item.label); // set input value
                if (onSelect) onSelect(item);
                if (clearResults) clearResults(); // collapse dropdown
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer"
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
