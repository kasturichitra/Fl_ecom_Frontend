// src/components/EditModalLayout.jsx
import React from "react";
import { FiX } from "react-icons/fi";

const EditModalLayout = ({
  title = "Edit",
  closeModal,
  children,
  onSubmit,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  isLoading = false,
  width = "max-w-3xl",
}) => {
  return (
    <div className="fixed inset-0 glass-container:
bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg
 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="relative sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-center items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

          <button
            onClick={closeModal}
            disabled={isLoading}
            className="absolute right-8 text-gray-500 hover:text-red-600 transition text-3xl"
          >
            <FiX />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="px-8 py-6">
          <div className="space-y-6">{children}</div>

          {/* Footer Buttons */}
          <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl transform hover:scale-105"
                }`}
            >
              {isLoading ? "Saving..." : submitLabel}
            </button>

            <button
              type="button"
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1 py-4 rounded-xl font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              {cancelLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalLayout;