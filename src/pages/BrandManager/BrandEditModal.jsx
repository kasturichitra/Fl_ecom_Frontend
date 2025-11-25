import { useState } from "react";
import CategorySelector from "../../components/CategorySelector";
import DynamicForm from "../../components/DynamicForm";
import EditModalLayout from "../../components/EditModalLayout";
import { useUpdateBrand } from "../../hooks/useBrand";
import { useGetAllCategories } from "../../hooks/useCategory";

const BrandEditModal = ({ brand, onClose, setEditingBrand, onSuccess, onSubmit }) => {
  // const { token, tenantId } = useSelector((state) => state.auth || {});


  const {
    mutateAsync: updateBrand,
    isPending: isUpdating,
    onSuccess: success,
  } = useUpdateBrand({
    onSettled: () => {
      setIsLoading(false);
      setEditingBrand(null);
    },
  });

  // console.log(brand, "brand");
  const { data: categoriesData, isLoaing, isError } = useGetAllCategories({});
  // console.log("categories", brand.categories);


  const getSelectedCategoryObjects = (brandCategories = [], categoriesData = []) => {
    if (!Array?.isArray(brandCategories) || !Array?.isArray(categoriesData)) return [];
    
    return categoriesData?.filter((cat) => brandCategories?.includes(cat?._id));
  };
  
  console.log("selected categories", getSelectedCategoryObjects(brand?.categories, categoriesData));

  const [form, setForm] = useState({
    categories: brand?.categories || [],
    brand_name: brand?.brand_name || "",
    brand_unique_id: brand?.brand_unique_id || "",
    brand_description: brand?.brand_description || "",
    brand_image: "",
  });


  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const validate = () => {
    const e = {};
    if (!form?.categories?.length) e.categories = "Please select at least one category";
    if (!form?.brand_name?.trim()) e.brand_name = "Brand name is required";
    if (!form?.brand_unique_id?.trim()) e.brand_unique_id = "Brand unique ID is required";
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

    form.categories.forEach((id) => fd?.append("categories[]", id));

    fd.append("brand_name", form?.brand_name);
    // fd.append("brand_unique_id", form.brand_unique_id);
    fd.append("brand_description", form?.brand_description || "");

    if (form?.brand_image && typeof form?.brand_image !== "string") {
      fd.append("brand_image", form?.brand_image);
    }

    if (!imagePreview && brand?.brand_image) {
      fd.append("brand_image", "");
    }

    try {
      console.log("before update");

      await updateBrand({
        id: brand?._id,
        data: fd,
      });

      setEditingBrand(null);

      console.log("after update");
    } catch (err) {
      // alert("Update failed: " + (err.message || "Please try again"));
    } finally {
      setIsLoading(false);
    }
  };

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
          categories={categoriesData}
          selected={form?.categories}
          setSelected={(vals) => setForm({ ...form, categories: vals })}
        />
        {errors?.categories && <p className="text-red-500 text-sm mt-2">{errors?.categories}</p>}
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
