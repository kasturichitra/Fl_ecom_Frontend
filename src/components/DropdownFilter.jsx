import React from "react";

// Data = [{label: "", value: ""}]
export const DropdownFilter = ({ value, onSelect, data }) => {
  return (
    <>
      <div className="w-48">
        <select
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {/* // {data.map((item, index) => (<option key={index} value={item.value}>{item.label}</option>))} */}

          {data?.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
