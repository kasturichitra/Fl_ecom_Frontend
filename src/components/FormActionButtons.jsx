const FormActionButtons = ({ onCancel, onSubmit, submitLabel = "Submit", isSubmitting }) => (
  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-6 mt-6 w-full">
    {/* Cancel */}
    <button
      type="button"
      onClick={onCancel}
      className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition"
    >
      Cancel
    </button>

    {/* Submit */}
    <button
      onClick={onSubmit}
      type="submit"
      disabled={isSubmitting}
      className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Submitting..." : submitLabel}
    </button>
  </div>
);

export default FormActionButtons;
