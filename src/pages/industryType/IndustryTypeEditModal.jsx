import React, { useState } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";
import toBase64 from "../../utils/toBase64";

const IndustryTypeEditModal = ({ formData: initialData, closeModal, onSubmit, isSubmitting }) => {
  const [formData, setLocalFormData] = useState({
    ...initialData,
  });

  const [imageFile, setImageFile] = useState(null);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const submitData = new FormData();

    // submitData.append("industry_name", formData?.industry_name || "");
    // submitData.append("industry_unique_id", formData?.industry_unique_id || "");
    // submitData.append("description", formData?.description || "");
    // submitData.append("is_active", formData?.is_active ?? true);

    // Only append NEW image
    // if (imageFile) {
    //   submitData.append("image", imageFile);
    // }

    const imageBase64 = await toBase64(formData?.image);
    const payload = {
      industry_name: formData?.industry_name,
      industry_unique_id: formData?.industry_unique_id,
      description: formData?.description,
      is_active: formData?.is_active,
      image_base64: imageBase64,
    }

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
      required: false,
      placeholder: "",
      disabled: true, // DynamicForm will need to support disabled
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
      onChange: (file) => setImageFile(file), // override DynamicForm handler
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
        // onCancel={onCancel}
        fields={fields}
        formData={formData}
        setFormData={setLocalFormData}
      />
    </EditModalLayout>
  );
};

export default IndustryTypeEditModal;
