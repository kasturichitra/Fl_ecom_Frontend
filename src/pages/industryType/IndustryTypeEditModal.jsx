import React, { useState } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";

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
    const submitData = new FormData();

    submitData.append("industry_name", formData?.industry_name || "");
    submitData.append("industry_unique_id", formData?.industry_unique_id || "");
    submitData.append("description", formData?.description || "");
    submitData.append("is_active", formData?.is_active ?? true);

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    await onSubmit(submitData);
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
            formData.currentImage ??
            initialData?.image_url?.low ??
            "",
        }}
        setFormData={setLocalFormData}
      />
    </EditModalLayout>
  );
};

export default IndustryTypeEditModal;
