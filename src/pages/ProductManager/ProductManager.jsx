import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DynamicForm from "../../components/DynamicForm";
import { createProduct } from "../../redux/productSlice";
import { useGetAllCategories, useGetCategoryByUniqueId } from "../../hooks/useCategory";
import { useGetAllBrands } from "../../hooks/useBrand";
import AttributeRepeater from "../../components/AttributeRepeater";
import ScrollWrapper from "../../components/ui/ScrollWrapper";

const ProductManager = () => {
  const dispatch = useDispatch();

  // Required fields only
  const initialForm = {
    category_unique_id: "",
    brand_unique_id: "",
    product_unique_id: "",
    product_name: "",
    product_description: "",
    product_color: "",
    product_size: "",
    product_image: "",
    price: "",
    discount_percentage: "",
    cgst: "",
    sgst: "",
    igst: "",
    stock_quantity: "",
    min_order_limit: "",
    gender: "",
    product_attributes: [],
  };

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { data: categories } = useGetAllCategories({
    search: categorySearchTerm,
  });

  const { data: brands } = useGetAllBrands({
    searchTerm: brandSearchTerm,
  });

  const formattedCategories = categories?.map((cat) => ({
    value: cat.category_unique_id,
    label: cat.category_name,
  }));

  const formattedBrands = brands?.map((brand) => ({
    value: brand.brand_unique_id,
    label: brand.brand_name,
  }));

  const { data: selectedCategoryItem } = useGetCategoryByUniqueId(selectedCategory);

  const selectedCategoryAttributes = selectedCategoryItem?.attributes || [];
  
  const dbAttributes = selectedCategoryAttributes.map((attr) => ({
    attribute_code: attr.code,
    value: "",
    placeholderValue: `Enter ${attr.name}`,
    type: "text",
  }));

  // --------------------------
  // REQUIRED FIELD LIST
  // --------------------------
  const productFields = [
    {
      key: "category_unique_id",
      label: "Category Unique ID *",
      type: "search",
      onSearch: (searchTerm) => {
        setCategorySearchTerm(searchTerm);
        setShowCategoryDropdown(true);
      },
      results: showCategoryDropdown ? formattedCategories : [],
      clearResults: () => {
        setCategorySearchTerm("");
        setShowCategoryDropdown(false);
      },
      onSelect: (value) => {
        setForm((prev) => ({ ...prev, category_unique_id: value.value }));
        setSelectedCategory(value.value);
      },
      placeholder: "e.g., HF1",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID *",
      type: "search",
      onSearch: (searchTerm) => {
        setBrandSearchTerm(searchTerm);
        setShowBrandDropdown(true);
      },
      results: showBrandDropdown ? formattedBrands : [],
      clearResults: () => {
        setBrandSearchTerm("");
        setShowBrandDropdown(false);
      },
      onSelect: (value) => setForm((prev) => ({ ...prev, brand_unique_id: value.value })),
      placeholder: "e.g., apple1",
    },
    {
      key: "product_unique_id",
      label: "Product Unique ID *",
      type: "text",
      required: true,
      placeholder: "e.g., HF1-002",
    },
    {
      key: "product_name",
      label: "Product Name *",
      type: "text",
      required: true,
      placeholder: "e.g., Premium Cotton Bedsheet",
    },
    {
      key: "product_description",
      label: "Product Description",
      type: "textarea",
      required: true,
      placeholder: "e.g., Premium Cotton Bedsheet",
    },
    {
      key: "product_color",
      label: "Product Color",
      type: "text",
      required: true,
      placeholder: "e.g., White",
    },
    {
      key: "product_size",
      label: "Product Size",
      type: "text",
      required: true,
      placeholder: "e.g., 3x4",
    },
    {
      key: "price",
      label: "Price *",
      type: "number",
      required: true,
      min: 0,
    },
    {
      key: "discount_percentage",
      label: "Discount Percentage",
      type: "number",
      min: 0,
      max: 99,
    },
    {
      key: "cgst",
      label: "CGST %",
      type: "number",
      min: 0,
    },
    {
      key: "sgst",
      label: "SGST %",
      type: "number",
      min: 0,
    },
    {
      key: "igst",
      label: "IGST %",
      type: "number",
      min: 0,
    },
    {
      key: "stock_quantity",
      label: "Stock Quantity *",
      type: "number",
      required: true,
      min: 0,
    },
    {
      key: "min_order_limit",
      label: "Minimum Order Limit *",
      type: "number",
      required: true,
      min: 1,
    },
    {
      key: "gender",
      label: "Gender *",
      type: "select",
      required: true,
      options: [
        { label: "Unisex", value: "Unisex" },
        { label: "Men", value: "Men" },
        { label: "Women", value: "Women" },
      ],
    },
    {
      key: "product_image",
      label: "Product Image *",
      type: "file",
      required: true,
    },
  ];

  // --------------------------
  // FORM SUBMIT
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalData = {
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity),
        min_order_limit: parseInt(form.min_order_limit),
      };

      await dispatch(createProduct(finalData)).unwrap();

      alert("Product created successfully!");
      setForm(initialForm);
    } catch (err) {
      alert("Failed to create product: " + (err.message || "Please try again"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <ScrollWrapper maxHeight="600px">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a product.</p>
        </div>

        <DynamicForm
          fields={productFields}
          formData={form}
          setFormData={setForm}
          onSubmit={handleSubmit}
          buttonLabel={isSubmitting ? "Saving..." : "Create Product"}
          disabled={isSubmitting}
          className="grid grid-cols-2 max-w-6xl"
        />

        <AttributeRepeater
          label="Product Attributes"
          predefined={dbAttributes}
          onChange={(values) => console.log("values", values)}
        />
      </ScrollWrapper>
    </div>
  );
};

export default ProductManager;
