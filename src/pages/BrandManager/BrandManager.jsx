import { useState, useMemo } from "react";
import { useCreateBrand } from "../../hooks/useBrand";
import BrandForm from "../../form/brands/brandsForm";
import { useGetAllCategories } from "../../hooks/useCategory";
import { brandFormDefaults } from "../../form/brands/brands.defaults.js";
import FormActionButtons from "../../components/FormActionButtons";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import toBase64 from "../../utils/toBase64";

const BrandManager = ({ setShowAddModal, onCancel }) => {
  const { mutateAsync: createBrand, isPending: isCreatingBrand } = useCreateBrand({
    onSuccess: () => {
      setShowAddModal(false);
    },
  });
  const { data: categoriesData } = useGetAllCategories();

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (setShowAddModal) setShowAddModal(false);
  };

  const formFields = useMemo(() => [
    {
      key: "brand_name",
      label: "Brand Name *",
      type: "text",
      placeholder: "Nike, Samsung...",
    },
    {
      key: "brand_description",
      label: "Brand Description",
      type: "textarea",
      placeholder: "Enter brand description",
    },
    {
      key: "image",
      label: "Brand Image *",
      type: "file",
      accept: "image/*",
    },
    {
      key: "is_active",
      label: "Active",
      type: "checkbox",
    },
  ], []);

  const handleCreateBrand = async (formData) => {
    let image_base64 = null;
    if (formData?.image instanceof File) {
      image_base64 = await toBase64(formData.image);
    }

    const payload = {
      brand_name: formData?.brand_name,
      brand_description: formData?.brand_description,
      categories: formData?.categories,
      is_active: formData?.is_active,
      // created_by: "Admin",
      // updated_by: "Admin",
      ...(image_base64 && { image_base64 }),
    };

    console.log("payload", payload);

    await createBrand(payload);
  };

  const defaultValues = brandFormDefaults();

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-xl">
      {/* Close Button */}
      <button
        onClick={handleCancel}
        className="absolute right-3 top-3 md:right-5 md:top-5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <ScrollWrapper maxHeight="800px">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Brand</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a new brand.</p>
        </div>

        {/* Form Body */}
        <BrandForm
          fields={formFields}
          categories={categoriesData?.data || []}
          onSubmit={handleCreateBrand}
          onCancel={handleCancel}
          defaultValues={defaultValues}
          isSubmitting={isCreatingBrand}
          className="grid grid-cols-1 gap-4"
          additionalContent={
            <>
              <FormActionButtons
                submitLabel={isCreatingBrand ? "Creating..." : "Create Brand"}
                onCancel={handleCancel}
                isSubmitting={isCreatingBrand}
              />
            </>
          }
        />
      </ScrollWrapper>
    </div>
  );
};
export default BrandManager;
