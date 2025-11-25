import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../../redux/productSlice";

const ProductEditModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brands.items || []);

  const [form, setForm] = useState(product);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(product);
  }, [product]);

  /** ✅ Validation logic */
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "product_name":
        if (!value.trim()) error = "Product name is required";
        break;
      case "price":
        if (!value || isNaN(value) || Number(value) <= 0)
          error = "Enter a valid price";
        break;
      case "discount_percentage":
        if (value && (isNaN(value) || value < 0 || value > 99))
          error = "Discount must be between 0–99%";
        break;
      case "product_unique_id":
        if (!value.trim()) error = "Product ID is required";
        break;
      case "brand_unique_ID":
        if (!value.trim()) error = "Brand is required";
        break;
      case "min_order_quantity":
        if (!value || isNaN(value) || Number(value) <= 0)
          error = "Enter valid min order quantity";
        break;
      case "max_order_quantity":
        if (
          !value ||
          isNaN(value) ||
          Number(value) <= 0 ||
          Number(value) < Number(form?.min_order_quantity)
        )
          error = "Max order must be greater than or equal to min order";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  /** 🧠 Handle changes */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  /** 💰 Auto calculate discount price */
  useEffect(() => {
    const price = parseFloat(form?.price);
    const discount = parseFloat(form?.discount_percentage);
    if (!isNaN(price) && !isNaN(discount)) {
      setForm((prev) => ({
        ...prev,
        discount_price: (price - (price * discount) / 100).toFixed(2),
      }));
    } else {
      setForm((prev) => ({ ...prev, discount_price: "" }));
    }
  }, [form?.price, form?.discount_percentage]);

  /** 💾 Submit handler */
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      alert("Please fix validation errors before saving.");
      return;
    }

    dispatch(updateProduct(form));
    alert("✅ Product updated successfully!");
    onClose();
  };

  const hasErrors = Object.values(errors).some((e) => e);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
          ✏️ Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Product ID */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Unique ID
            </label>
            <input
              type="text"
              name="product_unique_id"
              value={form?.product_unique_id || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={form?.product_name || ""}
              onChange={handleChange}
              className={`w-full border ${
                errors.product_name ? "border-red-400" : "border-gray-300"
              } rounded px-3 py-2`}
            />
            {errors.product_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product_name}
              </p>
            )}
          </div>

          {/* Brand Dropdown */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Select Brand
            </label>
            <select
              name="brand_unique_ID"
              value={form?.brand_unique_ID || ""}
              onChange={handleChange}
              className={`w-full border ${
                errors.brand_unique_ID ? "border-red-400" : "border-gray-300"
              } rounded px-3 py-2`}
            >
              <option value="">-- Choose Brand --</option>
              {brands.map((b, idx) => (
                <option key={idx} value={b.brand_unique_ID}>
                  {b.brand_name}
                </option>
              ))}
            </select>
            {errors.brand_unique_ID && (
              <p className="text-red-500 text-sm mt-1">
                {errors.brand_unique_ID}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Price (INR)
            </label>
            <input
              type="text"
              name="price"
              value={form?.price || ""}
              onChange={handleChange}
              className={`w-full border ${
                errors.price ? "border-red-400" : "border-gray-300"
              } rounded px-3 py-2`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="text"
              name="discount_percentage"
              value={form?.discount_percentage || ""}
              onChange={handleChange}
              className={`w-full border ${
                errors.discount_percentage
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded px-3 py-2`}
            />
            {errors.discount_percentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount_percentage}
              </p>
            )}
          </div>

          {/* Discounted Price (auto) */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Discounted Price
            </label>
            <input
              type="text"
              name="discount_price"
              value={form?.discount_price || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="text"
              name="stock_quantity"
              value={form?.stock_quantity || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              name="stock_availability"
              checked={form?.stock_availability || false}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="font-medium text-gray-700">
              Stock Availability
            </label>
          </div>

          {/* Min Order Quantity */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Min Order Quantity
            </label>
            <input
              type="number"
              name="min_order_quantity"
              value={form?.min_order_quantity || ""}
              onChange={handleChange}
              className={`w-full border ${
                errors.min_order_quantity
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded px-3 py-2`}
            />
            {errors.min_order_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.min_order_quantity}
              </p>
            )}
          </div>

          {/* Max Order Quantity */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Max Order Quantity
            </label>
            <input
              type="number"
              name="max_order_quantity"
              value={form?.max_order_quantity || ""}
              onChange={handleChange}
              className={`w-full border ${
                errors.max_order_quantity
                  ? "border-red-400"
                  : "border-gray-300"
              } rounded px-3 py-2`}
            />
            {errors.max_order_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.max_order_quantity}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasErrors}
              className={`px-4 py-2 rounded ${
                hasErrors
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
