import { useState } from "react";
import { useCreateBrand } from "../../hooks/useBrand";
import BrandForm from "../../form/brands/brandsForm";
import { useGetAllCategories } from "../../hooks/useCategory";
import { brandFormDefaults } from "../../form/brands/brands.defaults.js";

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

const BrandManager = ({ setShowAddModal, onCancel }) => {
  const [imagePreview, setImagePreview] = useState([]);
  const { mutateAsync: createBrand, isPending: isCreatingBrand } = useCreateBrand({
    onSuccess: () => {
      setShowAddModal(false);
      setImagePreview([]);
    },
  });
  const { data: categoriesData } = useGetAllCategories();

  const formFields = [
    { key: "brand_name", label: "Brand Name", type: "text", placeholder: "Nike, Samsung..." },
    // { key: "brand_unique_id", label: "Brand Unique ID", type: "text", placeholder: "BR-001" },
    { key: "brand_description", label: "Brand Description", type: "textarea" },
    { key: "brand_image", label: "Brand Image", type: "file" },
    { key: "is_active", label: "Active", type: "checkbox" },
  ];

  const handleCreateBrand = async (data) => {
    const { categories, brand_image, ...rest } = data;
    const formData = objectToFormData(rest);
    formData.append("brand_image", brand_image);
    formData.append("categories", `[${categories.map((id) => `"${id}"`).join(", ")}]`);

    await createBrand(formData);
  };

  const defaultValues = brandFormDefaults();

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Add New Brand</h2>

      <BrandForm
        fields={formFields}
        categories={categoriesData?.data || []}
        onSubmit={handleCreateBrand}
        onCancel={onCancel}
        defaultValues={defaultValues}
        isSubmitting={isCreatingBrand}
      />

      {imagePreview.length > 0 && (
        <div className="mt-4 flex space-x-2">
          {imagePreview.map((src, index) => (
            <img key={index} src={src} className="w-28 h-28 rounded-md border object-cover" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandManager;
