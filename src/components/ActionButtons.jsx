// components/ActionButtons.jsx
import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ActionButtons = ({ 
  row, 
  onEdit, 
  onDelete, 
  onSubmit,      // NEW
  onCancel       // NEW
}) => (
  <div className="flex justify-center gap-3">
    
    {/* Edit Button */}
    <button
      onClick={() => {
        onEdit(row);
        if (onSubmit) onSubmit(row);   // OPTIONAL
      }}
      className="flex items-center cursor-pointer gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition "
      title="Edit"
    >
      <PencilIcon className="h-4 w-4" />
      <span className="hidden sm:inline">Edit</span>
    </button>

    {/* Delete Button */}
    <button
      onClick={() => {
        onDelete(row);
        if (onCancel) onCancel(row);  // OPTIONAL
      }}
      className="flex items-center cursor-pointer gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition"
      title="Delete"
    >
      <TrashIcon className="h-4 w-4" />
      <span className="hidden sm:inline">Delete</span>
    </button>

  </div>
);

export default ActionButtons;
