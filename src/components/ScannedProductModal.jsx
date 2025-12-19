import React from "react";
import EditModalLayout from "./EditModalLayout";

const ScannedProductModal = ({ isOpen, scannedProduct, onClose, onAdd }) => {
  if (!isOpen || !scannedProduct) return null;

  return (
    <EditModalLayout
      title="Product Found"
      closeModal={onClose}
      onSubmit={onAdd}
      submitLabel="Add to Order"
      width="max-w-xl"
    >
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="p-2 border border-gray-200 rounded-lg overflow-hidden relative w-32 h-32 flex items-center justify-center bg-white">
          {/* Placeholder Image */}
          <img
            src="https://placehold.co/400x400/indigo/white?text=Product" // Using a nice placeholder
            alt="Product"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">{scannedProduct.product_name}</h4>
          <p className="text-gray-500 text-sm mt-1">{scannedProduct.product_unique_id}</p>
        </div>

        {/* Additional Details from JSON */}
        <div className="grid grid-cols-2 gap-4 w-full text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          {scannedProduct.brand_name && (
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase">Brand</span>
              <span className="font-medium text-gray-800">{scannedProduct.brand_name}</span>
            </div>
          )}
          {scannedProduct.category_name && (
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase">Category</span>
              <span className="font-medium text-gray-800">{scannedProduct.category_name}</span>
            </div>
          )}
          {scannedProduct.product_color && (
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase">Color</span>
              <span className="font-medium text-gray-800">{scannedProduct.product_color}</span>
            </div>
          )}
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 w-full border border-indigo-100">
          <div className="flex justify-between items-center text-lg text-indigo-700 font-bold">
            <span>Price:</span>
            <span>₹{Number(scannedProduct.final_price).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </EditModalLayout>
  );
};

export default ScannedProductModal;
