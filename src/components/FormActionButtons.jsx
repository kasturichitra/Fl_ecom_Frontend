const FormActionButtons = ({ onCancel, onSubmit, submitLabel = "Submit" }) => (
    <div className="flex items-center justify-end gap-10 mt-6">




        {/* Cancel */}
        <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition"
        >
            Cancel
        </button>


        
        {/* Submit */}
        <button
            onClick={onSubmit}
            type="submit"
            className="px-15 py-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition shadow"
        >
            {submitLabel}
        </button>

    </div>
);

export default FormActionButtons;
