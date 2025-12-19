import { QrCodeIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Activity } from "react"; // Assuming Activity is a component

const QrCodeGeneratorModal = ({ isOpen, onClose, product, onSubmit, isLoading }) => {
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (quantity && quantity > 0) {
      onSubmit(quantity);
    }
  };

  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <QrCodeIcon className="w-6 h-6" />
              Generate QR Code
            </h3>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" title="Close">
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Product Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium">
                {product?.product_name || "No Product Selected"}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="qr-quantity" className="text-sm font-medium text-gray-700 block">
                Quantity
              </label>
              <input
                id="qr-quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity to generate"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                min="1"
                autoFocus
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!quantity || quantity <= 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                "Print"
              )}
            </button>
          </div>
        </div>
      </div>
    </Activity>
  );
};

export default QrCodeGeneratorModal;
