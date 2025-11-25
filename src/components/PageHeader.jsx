import React from "react";

const PageHeader = ({ title, subtitle, actionLabel, onAction }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-7 flex justify-between items-center">
      
      {/* LEFT SIDE */}
      <div>
        <h1 className="text-4xl font-extrabold">{title}</h1>
        {subtitle && (
          <p className="text-indigo-100 text-lg mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* RIGHT SIDE ACTION BUTTON (optional) */}
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-white text-indigo-600 cursor-pointer font-bold px-6 py-3 
                 rounded-lg shadow-lg hover:bg-indigo-50 transition transform hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
