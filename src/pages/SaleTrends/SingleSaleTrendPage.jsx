import { ArrowLeft, ArrowRight, Check, Search, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useGetAllProducts } from "../../hooks/useProduct";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useGetSaleTrendByUniqueId, useUpdateSaleTrend } from "../../hooks/useSaleTrend";
import useDebounce from "../../hooks/useDebounce";

const SingleSaleTrendPage = () => {
  // --- URL PARAMS ---
  const { id: trendUniqueId } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Filters
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Trend Products (Selected)
  const [trendProducts, setTrendProducts] = useState([]);

  // Selection sets
  const [selectedAvailable, setSelectedAvailable] = useState(new Set());
  const [selectedTrend, setSelectedTrend] = useState(new Set());

  // --- QUERY: SALE TREND DATA ---
  const { data: saleTrendData, isLoading: trendLoading } = useGetSaleTrendByUniqueId(trendUniqueId);

  // Populate trendProducts when data loads
  useEffect(() => {
    if (saleTrendData?.data?.trend_products) {
      setTrendProducts(saleTrendData.data.trend_products);
    }
  }, [saleTrendData]);

  // --- QUERY: FILTERS ---
  const { data: brandsData } = useGetAllBrands({
    limit: 100, // Fetch reasonable amount for dropdown
    is_active: true,
    category_unique_id: categoryFilter,
  });

  const { data: categoriesData } = useGetAllCategories({
    limit: 100,
    is_active: true,
  });

  const brands = brandsData?.data || [];
  const categories = categoriesData?.data || [];

  // --- QUERY: PRODUCTS ---
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProducts({
    searchTerm: debouncedSearchTerm,
    page: 1,
    limit: 100,
    category_unique_id: categoryFilter,
    brand_unique_id: brandFilter,
  });

  const availableProductsData = useMemo(() => {
    return productsResponse?.data || [];
  }, [productsResponse]);

  // Derived: Available products excluding those already in Trend
  const displayedAvailableProducts = useMemo(() => {
    // Exclude products that are already in the right panel
    const trendIds = new Set(trendProducts.map((p) => p.product_unique_id));
    return availableProductsData.filter((p) => !trendIds.has(p.product_unique_id));
  }, [availableProductsData, trendProducts]);

  // --- HANDLERS ---

  // Toggle selection in Left Panel
  const toggleAvailableSelect = (id) => {
    const newSet = new Set(selectedAvailable);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAvailable(newSet);
  };

  // Toggle selection in Right Panel
  const toggleTrendSelect = (id) => {
    const newSet = new Set(selectedTrend);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedTrend(newSet);
  };

  // Move Selected -> Right
  const moveRight = () => {
    // Find full objects for selected IDs
    const toMove = displayedAvailableProducts.filter((p) => selectedAvailable.has(p.product_unique_id));

    setTrendProducts((prev) => [...prev, ...toMove]);
    setSelectedAvailable(new Set()); // Clear left selection
  };

  // Move Selected <- Left
  const moveLeft = () => {
    // We just remove them from trendProducts. They will automatically reappear in available list (filtered view).
    const remaining = trendProducts.filter((p) => !selectedTrend.has(p.product_unique_id));

    setTrendProducts(remaining);
    setSelectedTrend(new Set()); // Clear right selection
  };

  // Remove single item from Right Panel (Trash icon)
  const removeSingleFromTrend = (product) => {
    setTrendProducts((prev) => prev.filter((p) => p.product_unique_id !== product.product_unique_id));

    // Also remove from selection if it was selected
    if (selectedTrend.has(product.product_unique_id)) {
      const newSet = new Set(selectedTrend);
      newSet.delete(product.product_unique_id);
      setSelectedTrend(newSet);
    }
  };

  // --- HELPER: Image URL ---
  const getProductImage = (product) => {
    if (product.product_images && product.product_images.length > 0) {
      return `${import.meta.env.VITE_API_URL}/${product.product_images[0]}`;
    }
    return "https://placehold.co/100x100?text=No+Image";
  };

  // --- MUTATION: UPDATE SALE TREND ---
  const { mutate: updateSaleTrend, isPending: isSaving } = useUpdateSaleTrend();

  // --- SAVE HANDLERS ---
  const handleSave = () => {
    // Extract only product_unique_id for the API
    const productIds = trendProducts.map((p, index) => ({
      product_unique_id: p.product_unique_id,
      priority: index + 1,
    }));

    updateSaleTrend({
      id: trendUniqueId,
      data: { trend_products: productIds },
    });
  };

  const handleCancel = () => {
    navigate("/saleTrends");
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* 1. Header */}
      <PageHeader title="Edit Trend – Hot Deals" subtitle="Manage products included in this sale trend" />

      {/* 2. Main Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* === LEFT PANEL: AVAILABLE PRODUCTS === */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="p-6 border-b border-gray-100 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
              Available Products
            </h2>

            {/* Search and Filters */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[150px]"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.brand_unique_id} value={brand.brand_unique_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[150px]"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category_unique_id} value={cat.category_unique_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-10 text-red-500">Failed to load products. Please try again.</div>
            )}

            {/* List */}
            {!isLoading &&
              !isError &&
              displayedAvailableProducts.map((product) => (
                <div
                  key={product.product_unique_id}
                  onClick={() => toggleAvailableSelect(product.product_unique_id)}
                  className={`group flex items-center p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md
                  ${
                    selectedAvailable.has(product.product_unique_id)
                      ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-gray-200 hover:border-indigo-200"
                  }`}
                >
                  <div className="mr-4">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                    ${
                      selectedAvailable.has(product.product_unique_id)
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300 group-hover:border-indigo-400"
                    }`}
                    >
                      {selectedAvailable.has(product.product_unique_id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <img
                    src={getProductImage(product)}
                    alt={product.product_name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{product.product_name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {product.brand_name || "Brand"}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-gray-900">${product.final_price}</span>
                    </div>
                  </div>
                </div>
              ))}

            {!isLoading && !isError && displayedAvailableProducts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                {searchTerm ? "No products match your search" : "No available products found"}
              </div>
            )}
          </div>

          {/* Left Panel Sticky Footer */}
          <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={moveRight}
              disabled={selectedAvailable.size === 0}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all
                ${
                  selectedAvailable.size > 0
                    ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-[1.02]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Add Selected ({selectedAvailable.size})
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* === RIGHT PANEL: SELECTED PRODUCTS === */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="p-6 border-b border-gray-100 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-600" />
              Products in This Trend
            </h2>
            <p className="text-sm text-gray-500 ml-7">{trendProducts.length} products selected</p>
          </div>

          {/* Selected List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {trendProducts.map((product) => (
              <div
                key={product.product_unique_id}
                className={`group flex items-center p-3 rounded-xl border border-gray-100 transition-all hover:border-red-200 hover:shadow-sm
                   ${selectedTrend.has(product.product_unique_id) ? "bg-red-50 border-red-200" : "bg-white"}`}
              >
                <div onClick={() => toggleTrendSelect(product.product_unique_id)} className="cursor-pointer mr-4">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                    ${selectedTrend.has(product.product_unique_id) ? "bg-red-500 border-red-500" : "border-gray-200"}`}
                  >
                    {selectedTrend.has(product.product_unique_id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>

                <img
                  src={getProductImage(product)}
                  alt={product.product_name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-100 opacity-90"
                />

                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{product.product_name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      {product.brand_name || "Brand"}
                    </span>
                    <span className="font-medium text-gray-900">${product.final_price}</span>
                  </div>
                </div>

                <button
                  onClick={() => removeSingleFromTrend(product)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {trendProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                <ShoppingBag className="w-12 h-12 mb-3 text-gray-200" />
                <p>No products added yet</p>
                <p className="text-sm">Select products from the left panel to add them here.</p>
              </div>
            )}
          </div>

          {/* Right Panel Sticky Footer */}
          <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={moveLeft}
              disabled={selectedTrend.size === 0}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all border
                ${
                  selectedTrend.size > 0
                    ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
                    : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                }`}
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Remove Selected ({selectedTrend.size})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Global Sticky Page Footer */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex justify-between items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="text-sm text-gray-500">{isSaving && <span className="text-indigo-600">Saving...</span>}</div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-2.5 rounded-lg bg-linear-to-r from-indigo-600 to-purple-700 text-white font-bold shadow-md transition-all
            ${
              isSaving
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-lg hover:from-indigo-700 hover:to-purple-800 transform hover:-translate-y-0.5"
            }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default SingleSaleTrendPage;
