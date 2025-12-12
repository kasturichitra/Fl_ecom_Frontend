import FormActionButtons from "../../components/FormActionButtons";
import SaleTrendForm from "../../form/saleTrends/saleTrendForm";
import { useCreateSaleTrend } from "../../hooks/useSaleTrend";

const SaleTrendsManager = ({ onCancel }) => {
    const { mutateAsync: createSaleTrend } = useCreateSaleTrend({
        onSuccess: () => {
            onCancel();
            // toast.success("Sale trend added successfully");
        },
    });

    const handleCancel = () => {
        if (onCancel) onCancel();
    };

    const fields = [
        { key: "trend_name", label: "Trend Name", type: "text", width: 400 },
        { key: "trend_from", label: "From Date", type: "date", width: 400 },
        { key: "trend_to", label: "To Date", type: "date", width: 400 },
    ];

    const handleAddSaleTrend = async (formData) => {

        await createSaleTrend(formData);
    };

    return (
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 relative">

            {/* ONLY ADDED THIS BUTTON — NO OTHER CHANGE */}
            <button
                onClick={onCancel}
                className="absolute text-white right-3 top-1 text-gray-700 hover:text-red-600 text-3xl"
            >
                ×
            </button>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-10 text-center">
                <h2 className="text-4xl font-extrabold">Add New Sale Trend</h2>
            </div>

            <div className="p-8 bg-gray-50">
                <SaleTrendForm
                    fields={fields}
                    onSubmit={handleAddSaleTrend}
                    additionalContent={
                        <FormActionButtons
                            submitLabel="Create Sale Trend"
                            onCancel={handleCancel}
                        />
                    }
                />
            </div>
        </div>
    );
};

export default SaleTrendsManager;