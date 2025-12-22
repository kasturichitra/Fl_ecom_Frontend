import { useState } from "react";
import { useGetAllCategories } from "../../hooks/useCategory.js";
import { useGetTopProducts } from "../../hooks/useDashboard.js";
import CommonPieChart from "./CommonPieChart.jsx";

const TopProducts = ({ activeTab, from, to }) => {
  const colors = ["#a78bfa", "#60a5fa", "#93c5fd", "#6ee7b7", "#f87171", "#fb923c"];
  const [searchLabel, setSearchLabel] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { data: categories } = useGetAllCategories({ search: searchLabel });

  let formattedCategories =
    categories?.data?.map((ind) => ({
      label: ind?.category_name,
      value: ind?.category_unique_id,
    })) || [];

  const { data, isLoading, isError } = useGetTopProducts({ category_unique_id: selectedCategoryId, from, to });

  // extract products correctly with robust fallback
  const products =
    data?.[0]?.products || // Case 1: Array wrapping object [{ products: [...] }]
    data?.products || // Case 2: Direct object { products: [...] }
    (Array.isArray(data) ? data : []) || // Case 3: Direct array or fallback
    [];

  const totalCount = products.reduce((acc, curr) => acc + (Number(curr?.count) || 0), 0);

  const stats = products.map((b) => ({
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
      title="Top Products"
      labels={products.map((b) => b.product_name)}
      counts={products.map((b) => b.count)}
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

export default TopProducts;
