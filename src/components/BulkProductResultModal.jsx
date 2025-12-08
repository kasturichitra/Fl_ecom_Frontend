import React from "react";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { MdClose } from "react-icons/md";

/**
 * BulkProductResultModal - Displays the results of bulk product creation
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls modal visibility
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Object} props.resultData - API response data containing success/failure info
 */

export default function BulkProductResultModal({ open, onClose, resultData }) {
  if (!open || !resultData) return null;

  const { totalRows = 0, success = 0, failed = 0, errors = [] } = resultData;
  const hasErrors = failed > 0;
  const hasSuccess = success > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 animate-fadeIn">
        {/* Header Section */}
        <div
          className={`px-6 py-5 border-b ${
            hasErrors ? "bg-gradient-to-r from-orange-50 to-red-50" : "bg-gradient-to-r from-green-50 to-emerald-50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {hasErrors && !hasSuccess ? (
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiXCircle className="text-red-600 text-2xl" />
                </div>
              ) : hasErrors && hasSuccess ? (
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FiAlertCircle className="text-orange-600 text-2xl" />
                </div>
              ) : (
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-green-600 text-2xl" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800">Bulk Product Upload Results</h2>
                <p className="text-sm text-gray-600 mt-1">Upload completed - Review the summary below</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <MdClose className="text-gray-600 text-2xl" />
            </button>
          </div>
        </div>

        {/* Summary Stats Section */}
        <div className="px-5 py-3 bg-gray-50 border-b">
          <div className="grid grid-cols-3 gap-3">
            {/* Total Rows */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Rows</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{totalRows}</p>
            </div>

            {/* Success Count */}
            <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</span>
              </div>
              <p className="text-xl font-bold text-green-600">{success}</p>
            </div>

            {/* Failed Count */}
            <div className="bg-white rounded-lg p-3 border border-red-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Failed</span>
              </div>
              <p className="text-xl font-bold text-red-600">{failed}</p>
            </div>
          </div>
        </div>

        {/* Errors Section - Scrollable */}
        {hasErrors && (
          <div className="px-5 py-3">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="text-red-500 text-base" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Error Details ({errors.length})
              </h3>
            </div>

            {/* Scrollable Error List - 2 Column Grid */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-2">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-2.5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full">
                        {error.rowNumber}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-0.5">Row #{error.rowNumber}</p>
                      <div className="space-y-0.5">
                        {error.errors?.map((err, errIdx) => (
                          <div key={errIdx} className="flex items-start gap-1.5">
                            <span className="text-red-500 text-xs mt-0.5">•</span>
                            <p className="text-xs text-gray-700 flex-1 leading-snug">
                              {err.field && <span className="font-semibold text-red-700">{err.field}: </span>}
                              {err.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message - When no errors */}
        {!hasErrors && hasSuccess && (
          <div className="px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheckCircle className="text-green-600 text-3xl" />
            </div>
            <p className="text-lg font-semibold text-gray-800">All products created successfully!</p>
            <p className="text-sm text-gray-600 mt-2">
              {success} {success === 1 ? "product has" : "products have"} been added to your inventory.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
