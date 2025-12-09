import React from "react";
import TopBrands from "../TopBrandsChart.jsx";

const PerformanceTabComponent = ({ activeTab }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <p>Performance analytics will appear here...</p> */}
      <TopBrands activeTab={activeTab} />
    </div>
  );
};

export default PerformanceTabComponent;
