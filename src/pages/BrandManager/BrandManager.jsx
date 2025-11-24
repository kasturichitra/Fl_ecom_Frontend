import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateBrand } from "../../hooks/useBrand";

import DynamicForm from "../../components/DynamicForm";
import CategorySelector from "../../components/CategorySelector";
import FormActionButtons from "../../components/FormActionButtons";

// ------------------------
// FIXED: Better Object → FormData
// ------------------------
const objectToFormData = (obj) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

const BrandManager = () => {
  const dispatch = useDispatch();
  const { mutateAsync: createBrand } = useCreateBrand();

  const categories = useSelector((state) => state.categories?.items || []);

  const [form, setForm] = useState({
    categories: [],
    brand_name: "",
    brand_unique_id: "",
    brand_description: "",
    brand_image: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  // -------------------------
  // Validation
  // -------------------------
  const validate = () => {
    const e = {};

    if (!form.brand_name.trim()) e.brand_name = "Brand name is required";
    if (!form.brand_unique_id.trim()) e.brand_unique_id = "Brand Unique ID is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // -------------------------
  // Submit Handler
  // -------------------------
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { categories, brand_image, ...rest } = form;

    // Convert non-image fields
    const formData = objectToFormData(rest);

    formData.append("brand_image", brand_image);
    // Add image files
    // brand_image.forEach((file) => {
    // });

    // Convert category IDs -> JSON string
    const formattedCategories = `[${categories.map((id) => `"${id}"`).join(", ")}]`;
    formData.append("categories", formattedCategories);

    // console.log("brandImage", form.brand_image);
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": ", pair[1]);
    // }

    // return;
    // process.exit(1)
    await createBrand(formData);

    // Reset Form
    setForm({
      categories: [],
      brand_name: "",
      brand_unique_id: "",
      brand_description: "",
      brand_image: "",
    });

    setImagePreview([]);
  };

  // -------------------------
  // Image Handler
  // -------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({ ...form, brand_image: file });

      // Preview is an array
      setImagePreview([URL.createObjectURL(file)]);
    }
  };

  // -------------------------
  // Form Fields
  // -------------------------
  const formFields = [
    {
      key: "brand_name",
      label: "Brand Name",
      type: "text",
      required: true,
      placeholder: "Nike, Samsung...",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID",
      type: "text",
      required: true,
      placeholder: "BR-001",
    },
    {
      key: "brand_description",
      label: "Brand Description",
      type: "textarea",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Add New Brand</h2>

      <form onSubmit={handleCreateBrand} className="space-y-6">
        {/* Category Selector */}
        <CategorySelector
          categories={categories}
          selected={form.categories}
          setSelected={(values) => setForm({ ...form, categories: values })}
        />
        {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}

        {/* Dynamic Inputs */}
        <DynamicForm fields={formFields} formData={form} setFormData={setForm} errors={errors} />

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Brand Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded-md" />

          {/* Preview */}
          {imagePreview.length > 0 &&
            imagePreview.map((src, index) => (
              <img key={index} src={src} className="w-28 h-28 mt-3 rounded-md border object-cover" />
            ))}
        </div>

        {/* Action Buttons */}
        <FormActionButtons
          submitLabel="Add Brand"
          onCancel={() => {
            setForm({
              categories: [],
              brand_name: "",
              brand_unique_id: "",
              brand_description: "",
              brand_image: [],
            });
            setImagePreview([]);
          }}
        />
      </form>
    </div>
  );
};

export default BrandManager;
