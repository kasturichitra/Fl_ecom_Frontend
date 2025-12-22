import FormActionButtons from "../../components/FormActionButtons";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import IndustryTypeForm from "../../form/industyrTypes/industyTypeForm";
import { useCreateIndustry } from "../../hooks/useIndustry";
import { objectToFormData } from "../../utils/ObjectToFormData";

const IndustryTypeManager = ({ onCancel }) => {
  const { mutateAsync: createIndustry, isPending: isCreatingIndustry } = useCreateIndustry({
    onSuccess: () => {
      onCancel();
    },
  });

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const fields = [
    {
      key: "industry_name",
      label: "Industry Name *",
      type: "text",
      placeholder: "Enter industry name",
    },
    {
      key: "description",
      label: "Description *",
      type: "textarea",
      placeholder: "Enter description",
    },
    {
      key: "image",
      label: "Industry Image *",
      type: "file",
      accept: "image/*",
    },
    {
      key: "is_active",
      label: "Active",
      type: "checkbox",
    },
  ];

  const handleAddIndustryType = async (formData) => {
    const result = objectToFormData(formData);
    await createIndustry(result);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-xl">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Industry Type</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a new industry type.</p>
        </div>

        <IndustryTypeForm
          fields={fields}
          onSubmit={handleAddIndustryType}
          isSubmitting={isCreatingIndustry}
          onCancel={handleCancel}
          className="grid grid-cols-1 gap-4"
          additionalContent={
            <FormActionButtons
              submitLabel={isCreatingIndustry ? "Creating..." : "Create Industry Type"}
              isSubmitting={isCreatingIndustry}
              onCancel={handleCancel}
            />
          }
        />
      </ScrollWrapper>
    </div>
  );
};

export default IndustryTypeManager;
