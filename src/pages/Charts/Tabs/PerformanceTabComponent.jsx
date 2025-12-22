import React, { useState } from "react";
import TopBrands from "../TopBrandsChart.jsx";
import TopProducts from "../TopProductsChart.jsx";

const PerformanceTabComponent = ({ activeTab }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="flex flex-col gap-4">
      {/* Date Filters – same as OverallTabComponent */}
      <div className="flex gap-4 items-center justify-end pr-2">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        <TopBrands from={fromDate} to={toDate} activeTab={activeTab} />
        <TopProducts from={fromDate} to={toDate} activeTab={activeTab} />
      </div>
    </div>
  );
};

export default PerformanceTabComponent;
