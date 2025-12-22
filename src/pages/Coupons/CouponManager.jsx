import {
    Briefcase,
    Calendar,
    Check,
    IndianRupee,
    Layers,
    Percent,
    RefreshCw,
    Save,
    ShoppingBag,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import SearchDropdown from "../../components/SearchDropdown";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useCreateCoupon, useGenarateCouponCode, useGetCouponById, useUpdateCoupon } from "../../hooks/useCoupons";
import useDebounce from "../../hooks/useDebounce";
import { useGetAllProducts } from "../../hooks/useProduct";
import { useGetAllUsers } from "../../hooks/useUser";
import { DEBOUNCED_DELAY } from "../../lib/constants";

const CouponManager = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [generateCode, setGenerateCode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, DEBOUNCED_DELAY);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            coupon_code: "",
            coupon_type: "Generic",
            status: "Active",
            discount_type: "Percentage",
            discount_percentage: "",
            discount_amount: "",
            max_discount_amount: "",
            min_order_amount: "",
            apply_on: "Order",
            total_useage_limit: 1,
            per_user_limit: 1,
            coupon_start_date: "",
            coupon_end_date: "",
            brands: [],
            categories: [],
            products: [],
            user: []
        }
    });

    const { data: couponData, isLoading: isLoadingCoupon } = useGetCouponById(id);

    const discountType = watch("discount_type");
    const applyOn = watch("apply_on");
    const couponType = watch("coupon_type");
    const selectedBrands = watch("brands");
    const selectedCategories = watch("categories");
    const selectedProducts = watch("products");
    const selectedUsers = watch("user");

    useEffect(() => {
        if (isEditMode && couponData) {
            // Determine discount type based on what's available
            const inferredDiscountType = couponData.discount_percentage ? "Percentage" : "Fixed Amount";

            reset({
                ...couponData,
                discount_type: inferredDiscountType,
                coupon_start_date: couponData.coupon_start_date ? new Date(couponData.coupon_start_date).toISOString().split('T')[0] : "",
                coupon_end_date: couponData.coupon_end_date ? new Date(couponData.coupon_end_date).toISOString().split('T')[0] : "",
                // property name mapping
                brands: couponData.selected_brands || [],
                categories: couponData.selected_categories || [],
                products: couponData.selected_products || [],
                user: couponData.user || [],
                per_user_limit: couponData.user_usage_limit ?? couponData.per_user_limit ?? 1,
            });
        }
    }, [couponData, isEditMode, reset]);

    useEffect(() => {
        if (couponType === "Generic") {
            setValue("user", []);
        }
    }, [couponType, setValue]);

    useEffect(() => {
        if (applyOn === "Order") {
            setValue("products", []);
            setValue("categories", []);
            setValue("brands", []);
        } else if (applyOn === "Product") {
            setValue("categories", []);
            setValue("brands", []);
        } else if (applyOn === "Category") {
            setValue("products", []);
            setValue("brands", []);
        } else if (applyOn === "Brand") {
            setValue("products", []);
            setValue("categories", []);
        }
    }, [applyOn, setValue]);

    // Fetching data based on application scope
    const { data: categoryData } = useGetAllCategories({
        search: applyOn === "Category" ? debouncedSearch : "",
        limit: 100
    });
    const { data: brandData } = useGetAllBrands({
        searchTerm: applyOn === "Brand" ? debouncedSearch : "",
        limit: 100
    });
    const { data: productData } = useGetAllProducts({
        searchTerm: applyOn === "Product" ? debouncedSearch : "",
        limit: 100
    });
    const { data: userData } = useGetAllUsers({
        searchTerm: couponType === "User_Specific" && !showSuggestions ? "" : debouncedSearch,
        limit: 100
    });

    const { data: generatedCodeData, refetch: refetchCode, isFetching: isGenerating } = useGenarateCouponCode();
    const { mutate: createCoupon, isLoading: isCreating } = useCreateCoupon();
    const { mutate: updateCoupon, isLoading: isUpdating } = useUpdateCoupon();

    // Add loading state for edit mode
    if (isEditMode && isLoadingCoupon) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading coupon details...</p>
                </div>
            </div>
        );
    }

    const getDropdownOptions = () => {
        const data = applyOn === "Category" ? categoryData :
            applyOn === "Brand" ? brandData :
                applyOn === "Product" ? productData : null;

        if (!data) return [];

        // Handle common API response patterns: { data: [] } or the array itself
        const items = Array.isArray(data) ? data : (data?.data || data?.categories || data?.brands || data?.products || []);

        if (applyOn === "Category") {
            return items.map(cat => ({
                label: cat.category_name,
                value: cat.category_unique_id
            }));
        }
        if (applyOn === "Brand") {
            return items.map(brand => ({
                label: brand.brand_name,
                value: brand.brand_unique_id
            }));
        }
        if (applyOn === "Product") {
            return items.map(prod => ({
                label: prod.product_name,
                value: prod.product_unique_id
            }));
        }
        return [];
    };

    const handleSelect = (item) => {
        const fieldMap = {
            "Category": "categories",
            "Brand": "brands",
            "Product": "products"
        };
        const fieldName = fieldMap[applyOn];
        const currentItems = watch(fieldName);

        if (!currentItems.some(i => i.value === item.value)) {
            setValue(fieldName, [...currentItems, item]);
        }
        setSearchTerm("");
        setShowSuggestions(false);
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setShowSuggestions(true);
    };

    const handleRemove = (value, fieldName) => {
        const currentItems = watch(fieldName);
        setValue(fieldName, currentItems.filter(i => i.value !== value));
    };

    const handleGenerateCode = async () => {
        const result = await refetchCode();
        if (result.data) {
            setValue("coupon_code", result.data.code || result.data);
            toast.success("Coupon code generated!");
        }
    };

    const onSubmit = (data) => {
        const payload = {
            ...data,
            // Map back to API field names - now sending full objects/arrays of objects
            selected_brands: data.apply_on === "Brand" ? data.brands : [],
            selected_categories: data.apply_on === "Category" ? data.categories : [],
            selected_products: data.apply_on === "Product" ? data.products : [],
            user_usage_limit: data.per_user_limit,
        };

        // Clean up redundant/frontend-only fields
        delete payload.brands;
        delete payload.categories;
        delete payload.products;
        delete payload.per_user_limit;

        // Clean up payload based on discount type
        if (payload.discount_type === "Percentage") {
            delete payload.discount_amount;
        } else {
            delete payload.discount_percentage;
        }

        if (isEditMode) {
            updateCoupon({ id, couponData: payload }, {
                onSuccess: () => {
                    toast.success("Coupon updated successfully!");
                    navigate("/coupons");
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to update coupon");
                }
            });
        } else {
            createCoupon(payload, {
                onSuccess: () => {
                    toast.success("Coupon created successfully!");
                    navigate("/coupons");
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to create coupon");
                }
            });
        }
    };

    const scopeOptions = [
        { label: "Order", icon: ShoppingBag, value: "Order" },
        { label: "Product", icon: Layers, value: "Product" },
        { label: "Category", icon: Layers, value: "Category" },
        { label: "Brand", icon: Briefcase, value: "Brand" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
                    <PageHeader
                        title={isEditMode ? "Edit Coupon" : "Create New Coupon"}
                        subtitle="Design powerful discounts that drive conversions"
                    />

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 lg:p-10 space-y-12">
                        <BasicInfoSection
                            register={register}
                            errors={errors}
                            handleGenerateCode={handleGenerateCode}
                            isGenerating={isGenerating}
                        />

                        <DiscountSection
                            register={register}
                            discountType={discountType}
                            setValue={setValue}
                        />

                        <ScopeSection
                            applyOn={applyOn}
                            scopeOptions={scopeOptions}
                            searchTerm={searchTerm}
                            showSuggestions={showSuggestions}
                            handleSearchChange={handleSearchChange}
                            getDropdownOptions={getDropdownOptions}
                            handleSelect={handleSelect}
                            handleRemove={handleRemove}
                            selectedCategories={selectedCategories}
                            selectedBrands={selectedBrands}
                            selectedProducts={selectedProducts}
                            setValue={setValue}
                            setShowSuggestions={setShowSuggestions}
                        />

                        <ValiditySection
                            register={register}
                        />

                        {/* Form Actions */}

                        {/* Form Actions */}
                        <div className="pt-10 flex flex-col md:flex-row gap-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate("/coupons")}
                                className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="flex-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isCreating || isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>{isEditMode ? <><Save className="w-5 h-5" /> Save Changes</> : <><Check className="w-5 h-5" /> Create Coupon</>}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Basic Information Section
const BasicInfoSection = ({ register, errors, handleGenerateCode, isGenerating }) => (
    <section>
        <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-600 pl-4">
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                    <input
                        {...register("coupon_code", { required: "Coupon code is required" })}
                        placeholder="E.G., SUMMER2024"
                        className="w-full pl-4 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleGenerateCode}
                        disabled={isGenerating}
                        className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : "GENERATE"}
                    </button>
                </div>
                {errors.coupon_code && <p className="text-red-500 text-xs mt-1">{errors.coupon_code.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Coupon Type <span className="text-red-500">*</span></label>
                <select
                    {...register("coupon_type")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                    <option value="Generic">Generic</option>
                    <option value="User_Specific">User Specific</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select
                    {...register("status")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>
    </section>
);

// Discount Section
const DiscountSection = ({ register, discountType, setValue }) => (
    <section>
        <div className="flex items-center gap-2 mb-6 border-l-4 border-green-600 pl-4">
            <h2 className="text-xl font-bold text-gray-800">Discount Configuration</h2>
        </div>

        <div className="space-y-8">
            <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Discount Type <span className="text-red-500">*</span></label>
                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                        type="button"
                        onClick={() => setValue("discount_type", "Percentage")}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${discountType === "Percentage"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Percent className="w-4 h-4" /> Percentage
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue("discount_type", "Fixed Amount")}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${discountType === "Fixed Amount"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <IndianRupee className="w-4 h-4" /> Fixed Amount
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {discountType === "Percentage" ? (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Discount Percentage <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type="number"
                                {...register("discount_percentage", { required: discountType === "Percentage" })}
                                placeholder="10"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="absolute right-4 top-3.5 text-gray-400">%</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Discount Amount <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400">₹</span>
                            <input
                                type="number"
                                {...register("discount_amount", { required: discountType === "Fixed Amount" })}
                                placeholder="500"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Max Discount Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400">₹</span>
                        <input
                            type="number"
                            {...register("max_discount_amount")}
                            placeholder="500"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Minimum Order Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400">₹</span>
                        <input
                            type="number"
                            {...register("min_order_amount")}
                            placeholder="50"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Scope Section
const ScopeSection = ({
    applyOn,
    scopeOptions,
    searchTerm,
    showSuggestions,
    handleSearchChange,
    getDropdownOptions,
    handleSelect,
    handleRemove,
    selectedCategories,
    selectedBrands,
    selectedProducts,
    setValue,
    setShowSuggestions
}) => (
    <section>
        <div className="flex items-center gap-2 mb-6 border-l-4 border-purple-600 pl-4">
            <h2 className="text-xl font-bold text-gray-800">Application Scope</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scopeOptions.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("apply_on", option.value)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${applyOn === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    <option.icon className={`w-8 h-8 ${applyOn === option.value ? "text-blue-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{option.label}</span>
                </button>
            ))}
        </div>

        {applyOn !== "Order" && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <p className="text-sm font-medium text-gray-600">Search and Add {applyOn}</p>
                <div className="relative">
                    <SearchDropdown
                        value={searchTerm}
                        onChange={handleSearchChange}
                        results={showSuggestions && searchTerm ? getDropdownOptions() : []}
                        onSelect={handleSelect}
                        clearResults={() => setShowSuggestions(false)}
                        placeholder={`Type to search ${applyOn && applyOn?.toLowerCase()}...`}
                        customInputClass="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    />

                    <div className="mt-4 flex flex-wrap gap-2 max-h-20 overflow-y-auto custom-scrollbar p-2 rounded-xl bg-gray-50/50">
                        {(applyOn === "Category" ? selectedCategories :
                            applyOn === "Brand" ? selectedBrands :
                                selectedProducts).map((item) => (
                                    <span
                                        key={item.value}
                                        className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:bg-blue-100 shadow-sm"
                                    >
                                        {item.label}
                                        <Trash2
                                            className="w-3.5 h-3.5 cursor-pointer text-blue-400 hover:text-red-500 transition-colors"
                                            onClick={() => handleRemove(item.value, applyOn === "Category" ? "categories" : applyOn === "Brand" ? "brands" : "products")}
                                        />
                                    </span>
                                ))}

                        {(applyOn === "Category" ? selectedCategories :
                            applyOn === "Brand" ? selectedBrands :
                                selectedProducts).length === 0 && (
                                <p className="text-gray-400 text-sm italic p-2">No {applyOn && applyOn.toLowerCase()} selected yet.</p>
                            )}
                    </div>
                </div>
            </div>
        )}
    </section>
);

// Validity Section
const ValiditySection = ({ register }) => (
    <section>
        <div className="flex items-center gap-2 mb-6 border-l-4 border-orange-600 pl-4">
            <h2 className="text-xl font-bold text-gray-800">Usage & Validity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Total Usage Limit</label>
                    <input
                        type="number"
                        {...register("total_useage_limit")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Per User Usage Limit</label>
                    <input
                        type="number"
                        {...register("per_user_limit")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Start Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            {...register("coupon_start_date", { required: "Start date is required" })}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">End Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            {...register("coupon_end_date", { required: "End date is required" })}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default CouponManager;
