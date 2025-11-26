import FormActionButtons from "../../components/FormActionButtons";
import IndustryTypeForm from "../../form/industyrTypes/industyTypeForm";
import { useCreateIndustry } from "../../hooks/useIndustry";
import { objectToFormData } from "../../utils/ObjectToFormData";

const IndustryTypeManager = ({ onCancel }) => {
  const { mutateAsync: createIndustry } = useCreateIndustry({
    onSuccess: () => {
      onCancel();
    },
  });
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const fields = [
    {
      key: "industry_name", label: "Industry Name", type: "text",
    },
    {
      key: "industry_unique_id", label: "Unique ID", type: "text",
    },
    {
      key: "description", label: "Description", type: "textarea",
    },
    { key: "image", label: "Upload Image", type: "file", accept: "image/*" },
    { key: "is_active", label: "Active", type: "checkbox" },
  ];

  const handleAddIndustryType = async (formData) => {
    console.log("Fform state before AI PI call", formData);
    const result = objectToFormData(formData);
    await createIndustry(result);

  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-10 text-center">
        <h2 className="text-4xl font-extrabold">Add New Industry Type</h2>
      </div>

      <div className="p-8 bg-gray-50">
        {/* Form Fields Only */}
        <IndustryTypeForm
          fields={fields}
          onSubmit={handleAddIndustryType}
          additionalContent={
            <FormActionButtons
              submitLabel="Create Industry Type"
              onCancel={handleCancel}
            />
          }
        />
      </div>
    </div>
  );
};

export default IndustryTypeManager;
