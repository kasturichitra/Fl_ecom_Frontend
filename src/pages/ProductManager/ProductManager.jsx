import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DynamicForm from "../../components/DynamicForm";
import { createProduct } from "../../redux/productSlice";

const ProductManager = () => {
  const dispatch = useDispatch();

  // Required fields only
  const initialForm = {
    category_unique_id: "",
    brand_unique_id: "",
    product_unique_id: "",
    product_name: "",
    price: "",
    stock_quantity: "",
    min_order_limit: "",
    gender: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------------------------
  // REQUIRED FIELD LIST
  // --------------------------
  const productFields = [
    {
      key: "category_unique_id",
      label: "Category Unique ID",
      type: "text",
      required: true,
      placeholder: "e.g., HF1",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID",
      type: "text",
      required: true,
      placeholder: "e.g., BR01",
    },
    {
      key: "product_unique_id",
      label: "Product Unique ID",
      type: "text",
      required: true,
      placeholder: "e.g., HF1-002",
    },
    {
      key: "product_name",
      label: "Product Name",
      type: "text",
      required: true,
      placeholder: "e.g., Premium Cotton Bedsheet",
    },
    {
      key: "price",
      label: "Price",
      type: "number",
      required: true,
      min: 0,
    },
    {
      key: "stock_quantity",
      label: "Stock Quantity",
      type: "number",
      required: true,
      min: 0,
    },
    {
      key: "min_order_limit",
      label: "Minimum Order Limit",
      type: "number",
      required: true,
      min: 1,
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: [
        { label: "Unisex", value: "Unisex" },
        { label: "Men", value: "Men" },
        { label: "Women", value: "Women" },
      ],
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
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        min_order_limit: parseInt(formData.min_order_limit),
      };

      await dispatch(createProduct(finalData)).unwrap();

      alert("Product created successfully!");
      setFormData(initialForm);
    } catch (err) {
      alert("Failed to create product: " + (err.message || "Please try again"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Update Product</h1>
        <p className="text-gray-600 mt-2">
          Fill the required fields to create a product.
        </p>
      </div>

      <DynamicForm
        fields={productFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonLabel={isSubmitting ? "Saving..." : "Create Product"}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default ProductManager;
