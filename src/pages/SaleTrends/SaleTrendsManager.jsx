import FormActionButtons from "../../components/FormActionButtons";
import SaleTrendForm from "../../form/saleTrends/saleTrendForm";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import { useCreateSaleTrend } from "../../hooks/useSaleTrend";

const SaleTrendsManager = ({ onCancel }) => {
  const { mutateAsync: createSaleTrend, isPending: isCreatingSaleTrend } = useCreateSaleTrend({
    onSuccess: () => {
      onCancel();
    },
  });

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const fields = [
    {
      key: "trend_name",
      label: "Trend Name *",
      type: "text",
      placeholder: "Enter trend name",
    },
    {
      key: "trend_from",
      label: "From Date *",
      type: "date",
    },
    {
      key: "trend_to",
      label: "To Date *",
      type: "date",
    },
  ];

  const handleAddSaleTrend = async (formData) => {
    await createSaleTrend(formData);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Close Button */}
      <button
        onClick={handleCancel}
        className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
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
          <h1 className="text-3xl font-bold text-gray-800">Create Sale Trend</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a new sale trend.</p>
        </div>

        {/* Form Body */}
        <SaleTrendForm
          fields={fields}
          onSubmit={handleAddSaleTrend}
          onCancel={handleCancel}
          className="grid grid-cols-1 gap-4"
          additionalContent={
            <FormActionButtons
              submitLabel={isCreatingSaleTrend ? "Creating..." : "Create Sale Trend"}
              isSubmitting={isCreatingSaleTrend}
              onCancel={handleCancel}
            />
          }
        />
      </ScrollWrapper>
    </div>
  );
};

export default SaleTrendsManager;
