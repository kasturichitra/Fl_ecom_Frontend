import { FaCog } from "react-icons/fa";

const ColumnVisibilitySelector = ({ headers, updateTableHeaders, isDropdownOpen, setIsDropdownOpen, dropdownRef }) => {
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
            >
                <FaCog className="text-gray-500" />
                <span>Columns</span>
            </button>

            {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-700">Toggle Columns</h3>
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto">
                        {headers.map((header) => (
                            <label
                                key={header.key}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={header.value}
                                        onChange={() => {
                                            const updatedHeaders = headers.map((h) =>
                                                h.key === header.key ? { ...h, value: !h.value } : h
                                            );
                                            updateTableHeaders(updatedHeaders);
                                        }}
                                        className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                                <span className="text-sm text-gray-700 font-medium">{header.key}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnVisibilitySelector;
