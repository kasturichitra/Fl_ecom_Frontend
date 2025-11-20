import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBrand } from "../../redux/brandSlice";
import CategorySelector from "../../components/CategorySelector";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";

const BrandEditModal = ({ brand, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items || []);
  const { token, tenantId } = useSelector((state) => state.auth || {});

  const [form, setForm] = useState({
    categories: brand.categories || [],
    brand_name: brand.brand_name || "",
    brand_unique_id: brand.brand_unique_id || "",
    brand_description: brand.brand_description || "",
    brand_image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load initial image
  useEffect(() => {
    if (brand.brand_image) {
      const fullUrl = `${process.env.REACT_APP_API_URL}/${brand.brand_image.replace(
        /\\/g,
        "/"
      )}`;
      setImagePreview(fullUrl);
    }
  }, [brand.brand_image]);

  const validate = () => {
    const e = {};
    if (!form.categories.length) e.categories = "Please select at least one category";
    if (!form.brand_name.trim()) e.brand_name = "Brand name is required";
    if (!form.brand_unique_id.trim()) e.brand_unique_id = "Brand unique ID is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (file) => {
    if (file) {
      setForm({ ...form, brand_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, brand_image: "" });
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const fd = new FormData();

    form.categories.forEach((id) => fd.append("category_unique_ids[]", id));

    fd.append("brand_name", form.brand_name);
    fd.append("brand_unique_id", form.brand_unique_id);
    fd.append("brand_description", form.brand_description || "");

    if (form.brand_image && typeof form.brand_image !== "string") {
      fd.append("brand_image", form.brand_image);
    }

    if (!imagePreview && brand.brand_image) {
      fd.append("brand_image", "");
    }

    try {
      await dispatch(
        updateBrand({
          uniqueId: brand._id,
          formData: fd,
          token,
          tenantId,
        })
      ).unwrap();

      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Update failed: " + (err.message || "Please try again"));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------
  // ⭐ DynamicForm Field Config
  // ---------------------------
  const fields = [
    {
      key: "brand_name",
      label: "Brand Name",
      type: "text",
      required: true,
      placeholder: "e.g. Nike",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID",
      type: "text",
      disabled: true, // DynamicForm will render read-only
    },
    {
      key: "brand_description",
      label: "Description",
      type: "textarea",
      rows: 4,
    },
    {
      key: "brand_image",
      label: "Upload New Image",
      type: "file",
      accept: "image/*",
      onChange: handleImageChange,
    },
  ];

  return (
    <EditModalLayout
      title="Edit Brand"
      closeModal={onClose}
      onSubmit={handleSubmit}
      submitLabel="Update Brand"
      isLoading={isLoading}
    >
      {/* Category Selector (Not in DynamicForm) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Categories <span className="text-red-500">*</span>
        </label>
        <CategorySelector
          categories={categories}
          selected={form.categories}
          setSelected={(vals) => setForm({ ...form, categories: vals })}
        />
        {errors.categories && (
          <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
        )}
      </div>

      {/* ⭐ Dynamic Form Handles all other fields */}
      <DynamicForm fields={fields} formData={form} setFormData={setForm} />

      {/* Image Preview Section */}
      {imagePreview && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Current Image</p>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Brand"
                className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200 shadow-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </EditModalLayout>
  );
};

export default BrandEditModal;
