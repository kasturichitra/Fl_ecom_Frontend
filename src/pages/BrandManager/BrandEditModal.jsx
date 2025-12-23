import { useEffect, useState } from "react";
import DynamicForm from "../../components/DynamicForm";
import EditModalLayout from "../../components/EditModalLayout";
import { useUpdateBrand } from "../../hooks/useBrand";
import { useGetAllCategories } from "../../hooks/useCategory";
import toBase64 from "../../utils/toBase64";
import CategorySelector from "../../components/CategorySelector";

const BrandEditModal = ({ brand, onClose, onSuccess }) => {
  const { mutateAsync: updateBrand, isPending: isUpdatingBrand } = useUpdateBrand();
  const { data: categoriesData } = useGetAllCategories({});

  const [form, setForm] = useState({
    categories: [],
    brand_name: "",
    brand_unique_id: "",
    brand_description: "",
    brand_image: null,
    currentImage: null,
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brand) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

      const lowUrl = brand?.brand_image?.low || brand?.brand_image?.url || "";

      setForm({
        categories: brand?.categories || [],
        brand_name: brand?.brand_name || "",
        brand_unique_id: brand?.brand_unique_id || "",
        brand_description: brand?.brand_description || "",
        image: null,
        currentImage: lowUrl || null,
        is_active: brand?.is_active ?? true,
      });
    }
  }, [brand]);

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      image: "REMOVE",
      currentImage: null,
    }));
  };

  const validate = () => {
    const e = {};
    if (!form?.categories?.length) e.categories = "Please select at least one category";
    if (!form?.brand_name?.trim()) e.brand_name = "Brand name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let image_base64 = null;
    if (form?.image instanceof File) {
      image_base64 = await toBase64(form.image);
    }

    const payload = {
      brand_name: form?.brand_name,
      brand_description: form?.brand_description || "",
      categories: form?.categories,
      is_active: form?.is_active,
      ...(image_base64 && { image_base64 }),
      ...(form.image === "REMOVE" && { remove_image: true }),
    };

    await updateBrand({
      id: form?.brand_unique_id,
      data: payload,
    });
    onClose();
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
      disabled: true,
    },
    {
      key: "brand_description",
      label: "Description",
      type: "textarea",
      rows: 4,
    },
    {
      key: "image",
      label: "Brand Image",
      type: "file",
      accept: "image/*",
      onChange: (file) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setForm((prev) => ({
          ...prev,
          image: file,
          currentImage: previewUrl,
        }));
      },
      onRemove: removeImage,
    },
    {
      key: "is_active",
      label: "Active",
      type: "checkbox",
    },
  ];

  return (
    <EditModalLayout
      title="Edit Brand"
      closeModal={onClose}
      onSubmit={handleSubmit}
      submitLabel="Update Brand"
      isLoading={isUpdatingBrand}
    >
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Categories <span className="text-red-500">*</span>
        </label>
        <CategorySelector
          categories={categoriesData?.data}
          selected={form?.categories}
          setSelected={(vals) => setForm({ ...form, categories: vals })}
        />
        {errors?.categories && <p className="text-red-500 text-sm mt-2">{errors?.categories}</p>}
      </div>

      <DynamicForm fields={fields} formData={form} setFormData={setForm} />
    </EditModalLayout>
  );
};

export default BrandEditModal;
