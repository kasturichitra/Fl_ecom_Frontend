import { useState } from "react";
import { useGetAllCategories } from "../../hooks/useCategory.js";
import { useGetTopBrands } from "../../hooks/useDashboard.js";
import CommonPieChart from "./CommonPieChart.jsx";

const TopBrands = ({ activeTab }) => {
  const colors = ["#a78bfa", "#60a5fa", "#93c5fd", "#6ee7b7", "#f87171", "#fb923c"];
  const [searchLabel, setSearchLabel] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { data: categories } = useGetAllCategories({ search: searchLabel });

  let formattedCategories =
    categories?.data?.map((ind) => ({
      label: ind?.category_name,
      value: ind?.category_unique_id,
    })) || [];

  const { data, isLoading, isError } = useGetTopBrands({ category_unique_id: selectedCategoryId });

  const brands =
    data?.[0]?.brands ||    
    data?.brands ||          
    (Array.isArray(data) ? data : []) || 
    [];

  const totalCount = brands.reduce((acc, curr) => acc + (Number(curr?.count) || 0), 0);

  const stats = brands.map((b) => ({
    count: b.count,
    totalAmount: b.total_amount || 0,
    percentage: totalCount > 0 ? ((b.count / totalCount) * 100).toFixed(2) : 0,
  }));

  const handleSearchChange = (val) => {
    if (typeof val === "string") {
      setSearchLabel(val);
    } else if (val && typeof val === "object") {
      setSearchLabel(val.label);
      setSelectedCategoryId(val.value);
    }
  };

  return (
    <CommonPieChart
      title="Top Brands"
      labels={brands.map(b => b.brand_name)}
      counts={brands.map(b => b.count)}
      stats={stats}
      colors={colors}
      isLoading={isLoading}
      isError={isError}
      activeTab={activeTab}
      data={formattedCategories}
      setSearch={handleSearchChange}
      search={searchLabel}

    />
  );
};

export default TopBrands;
