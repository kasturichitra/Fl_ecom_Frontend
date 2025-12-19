import React, { useState } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";

const SaleTrendEditModal = ({ formData: initialData, closeModal, onSubmit, isSubmitting }) => {
  // Helper to convert date to YYYY-MM-DD format for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date?.toISOString().split("T")[0];
  };

  const [formData, setLocalFormData] = useState({
    ...initialData,
    trend_from: formatDateForInput(initialData?.trend_from),
    trend_to: formatDateForInput(initialData?.trend_to),
  });

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      trend_name: formData?.trend_name || "",
      trend_from: formData?.trend_from || "",
      trend_to: formData?.trend_to || "",
    };

    await onSubmit(submitData);
  };

  const fields = [
    {
      key: "trend_name",
      label: "Trend Name",
      type: "text",
      required: true,
      placeholder: "Enter trend name",
    },
    {
      key: "trend_from",
      label: "From Date",
      type: "date",
      required: true,
    },
    {
      key: "trend_to",
      label: "To Date",
      type: "date",
      required: true,
    },
  ];

  return (
    <EditModalLayout
      title="Edit Sale Trend"
      closeModal={closeModal}
      onSubmit={handleSubmit}
      submitLabel="Update Sale Trend"
      isLoading={isSubmitting}
    >
      <DynamicForm fields={fields} formData={formData} setFormData={setLocalFormData} />
    </EditModalLayout>
  );
};

export default SaleTrendEditModal;
