import React, { useState } from "react";
import { FaFont, FaPlus } from "react-icons/fa";

// Reusable Size Input Component
const SizeInput = ({ label, value, onChange, min, max, placeholder }) => {
  return (
    <div className="mb-5">
      <label className="block mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

const TypographyPicker = ({
  theme,
  onTypographyChange,
  popularFonts,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <FaFont className="text-purple-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">
          Typography Settings
        </h2>
      </div>

      {/* Heading Size */}
      <SizeInput
        label="Heading Size (px)"
        value={theme.typography.heading_size}
        onChange={(e) => onTypographyChange("heading_size", e.target.value)}
        min="16"
        max="72"
        placeholder="32"
      />

      {/* Body Size */}
      <SizeInput
        label="Body Size (px)"
        value={theme.typography.body_size}
        onChange={(e) => onTypographyChange("body_size", e.target.value)}
        min="12"
        max="24"
        placeholder="16"
      />

      {/* Font Family */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Font Family
          </span>
        </label>

        {/* Custom Font Input Section */}
        <div className="mb-4 p-4 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Add Custom Font
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Your Custom Font"
              value={theme.typography.font_family}
              onChange={(e) => onTypographyChange("font_family", e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        <div className="space-y-2 max-h-128 overflow-y-auto pr-2 custom-scrollbar">
          {popularFonts.map((font) => (
            <button
              key={font}
              onClick={() => onTypographyChange("font_family", font)}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                theme.typography.font_family === font
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-800 hover:bg-purple-100 shadow-sm border border-gray-200"
              }`}
            >
              <span className="font-semibold text-sm">{font}</span>
              <p
                className={`text-xs mt-1 ${
                  theme.typography.font_family === font
                    ? "text-purple-100"
                    : "text-gray-500"
                }`}
                style={{ fontFamily: font }}
              >
                The quick brown fox jumps
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div
        className="mt-6 p-5 rounded-xl border-2 border-gray-200"
        style={{
          backgroundColor: theme.colors.background,
          fontFamily: theme.typography.font_family,
        }}
      >
        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
          Typography Preview
        </p>
        <h3
          style={{
            fontSize: `${theme.typography.heading_size}px`,
            color: theme.colors.primary,
            fontFamily: theme.typography.font_family,
          }}
          className="font-bold mb-2"
        >
          Heading Text
        </h3>
        <p
          style={{
            fontSize: `${theme.typography.body_size}px`,
            color: theme.colors.text,
            fontFamily: theme.typography.font_family,
          }}
        >
          This is body text preview. The quick brown fox jumps over the lazy
          dog.
        </p>
      </div>
    </div>
  );
};

export default TypographyPicker;
