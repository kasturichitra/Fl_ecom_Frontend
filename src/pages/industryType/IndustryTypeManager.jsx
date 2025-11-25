import { useState } from "react";
import DynamicForm from "../../components/DynamicForm";
import FormActionButtons from "../../components/FormActionButtons";
import { useCreateIndustry } from "../../hooks/useIndustry";
import { objectToFormData } from "../../utils/ObjectToFormData";

const IndustryTypeManager = ({ onCancel }) => {
  const { mutateAsync: createIndustry } = useCreateIndustry();

  const [form, setForm] = useState({
    industry_name: "",
    industry_unique_id: "",
    description: "",
    image: null,
    is_active: true,
  });

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const fields = [
    { key: "industry_name", label: "Industry Name", type: "text", required: true },
    { key: "industry_unique_id", label: "Unique ID", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "image", label: "Upload Image", type: "file", accept: "image/*" },
    { key: "is_active", label: "Active", type: "checkbox" },
  ];

  const handleAddIndustryType = async () => {

    try {
      const formData = objectToFormData(form);

      await createIndustry(formData);

      // Reset UI state if needed (React Query already navigates & toasts)
      setForm({
        industry_name: "",
        industry_unique_id: "",
        description: "",
        image: null,
        is_active: true,
      });
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-10 text-center">
        <h2 className="text-4xl font-extrabold">Add New Industry Type</h2>
      </div>

      <div className="p-8 bg-gray-50">
        {/* Form Fields Only */}
        <DynamicForm
          fields={fields}
          formData={form}
          setFormData={setForm}
          // onSubmit={handleAddIndustryType}
        />

        {/* Submit / Cancel Buttons */}
        <FormActionButtons
          submitLabel="Create Industry Type"
          onSubmit={() => {
            handleAddIndustryType();
          }}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default IndustryTypeManager;
