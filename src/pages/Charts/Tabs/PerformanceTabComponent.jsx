import React from "react";
import TopBrands from "../TopBrandsChart.jsx";
import TopProducts from "../TopProductsChart.jsx";

const PerformanceTabComponent = ({ activeTab }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TopBrands activeTab={activeTab} />
      <TopProducts activeTab={activeTab} />
    </div>
  );
};

export default PerformanceTabComponent;
