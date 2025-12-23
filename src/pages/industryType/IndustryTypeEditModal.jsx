import React, { useState } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";
import toBase64 from "../../utils/toBase64";

const IndustryTypeEditModal = ({
  formData: initialData,
  closeModal,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setLocalFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  console.log("initail Data", initialData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageBase64 = null;
    if (imageFile) {
      imageBase64 = await toBase64(imageFile);
    }

    const payload = {
      industry_name: formData?.industry_name ?? initialData?.industry_name,
      industry_unique_id: formData?.industry_unique_id ?? initialData?.industry_unique_id,
      description: formData?.description ?? initialData?.description,
      is_active: formData?.is_active ?? initialData?.is_active,
      ...(imageBase64 && { image_base64: imageBase64 }),
    };

    await onSubmit(payload);
  };

  const fields = [
    {
      key: "industry_name",
      label: "Industry Name",
      type: "text",
      required: true,
      placeholder: "Enter industry name",
    },
    {
      key: "industry_unique_id",
      label: "Unique ID",
      type: "text",
      disabled: true,
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      rows: 4,
    },
    {
      key: "image",
      label: "Upload Image (New Only)",
      type: "file",
      accept: "image/*",
      onChange: (file) => {
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setImageFile(file);
        setLocalFormData((prev) => ({
          ...prev,
          currentImage: previewUrl,
        }));
      },
    },
    {
      key: "is_active",
      label: "Active",
      type: "checkbox",
    },
  ];

  return (
    <EditModalLayout
      title="Edit Industry Type"
      closeModal={closeModal}
      onSubmit={handleSubmit}
      submitLabel="Update Industry Type"
      isLoading={isSubmitting}
    >
      <DynamicForm
        fields={fields}
        formData={{
          ...initialData,
          ...formData,
          currentImage:
            formData.currentImage ||
            initialData?.image_url?.low ||
            initialData?.image_url?.medium ||
            initialData?.image_url?.original ||
            (typeof initialData?.image_url === "string" ? initialData.image_url : ""),
        }}
        setFormData={setLocalFormData}
      />
    </EditModalLayout>
  );
};

export default IndustryTypeEditModal;
