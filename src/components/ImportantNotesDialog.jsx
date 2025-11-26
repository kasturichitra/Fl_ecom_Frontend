import React from "react";
import { Button } from "@mui/material";

/* ------------------- Custom Dialog Component ------------------- */
function Dialog({ open, onClose, children, maxWidth = "700px" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/20 bg-opacity-50"
        onClick={() => setTimeout(onClose, 0)} // FIXED
      />

      {/* Dialog Box */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------- Important Notes Dialog ------------------- */
export default function ImportantNotesDialog({ open, onClose, onProceed }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="700px">
      <h2 className="text-xl font-bold mb-4">Important Notes Before Filling the Excel</h2>

      <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
        <li>Product Unique ID is a unique identifier which user will have to give to each product.</li>
        <li>
          In One Excel sheet, try to fill only one category related products like mobiles once, laptops once etc..!
        </li>
        <li>
          While mentioning product name, try to give complete name like "Apple iPhone 17 Orange" instead of "iPhone 17".
        </li>
        <li>Brand Id is required for each product, this is the same brand Id u give while creating a brand.</li>
        <li>For Price, if you are giving MRP, don't fill sgst, cgst values..! Avoid them.</li>
        <li>
          {" "}
          But if u are giving purchase price and want tax related calculations, then price column shall be filled with
          purchase price and gst values shall be filled with percentages like sgst 9%, cgst 9% etc.. !
        </li>
        <li>
          {" "}
          Minimum order limit is the minimum number of products need to be purchased in one order, also known as Minimum
          Order Quantity - MOQ.
        </li>
        <li>
          If ur product is not gender specific i.e. not made for only women or men etc..! Fill that field with "Unisex"
          value.
        </li>
        <li> For attributes, fill the unknown or unspecified values with "N/A".</li>
        <li>
          If u feel any specification/attribute is missed out, feel free to add it with "attr_" prefix like if u think
          Memory is missing for mobiles, add "attr_memory" and enter the values for each mobile in the excel.
        </li>
      </ol>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outlined" onClick={() => setTimeout(onClose, 0)}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            setTimeout(() => {
              onClose();
              onProceed();
            }, 0); // FIXED
          }}
        >
          Proceed
        </Button>
      </div>
    </Dialog>
  );
}
