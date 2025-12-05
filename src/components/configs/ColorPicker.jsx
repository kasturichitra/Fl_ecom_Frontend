import { FaPalette } from "react-icons/fa";

const ColorPicker = ({ theme, onColorChange, onModeChange }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
      <div className="flex items-center gap-3 mb-6">
        <FaPalette className="text-indigo-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">Color Settings</h2>
      </div>

      {/* Mode Selector */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Theme Mode</span>
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => onModeChange("light")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              theme.mode === "light"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => onModeChange("dark")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              theme.mode === "dark"
                ? "bg-gray-800 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Primary Color */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Primary Color</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.colors.primary}
            onChange={(e) => onColorChange("primary", e.target.value)}
            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-indigo-500 transition-colors"
          />
          <div className="flex-1">
            <input
              type="text"
              value={theme.colors.primary}
              onChange={(e) => onColorChange("primary", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="#4f46e5"
            />
          </div>
        </div>
      </div>

      {/* Secondary Color */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Secondary Color</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.colors.secondary}
            onChange={(e) => onColorChange("secondary", e.target.value)}
            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-purple-500 transition-colors"
          />
          <div className="flex-1">
            <input
              type="text"
              value={theme.colors.secondary}
              onChange={(e) => onColorChange("secondary", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="#9333ea"
            />
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Background Color</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.colors.background}
            onChange={(e) => onColorChange("background", e.target.value)}
            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-blue-500 transition-colors"
          />
          <div className="flex-1">
            <input
              type="text"
              value={theme.colors.background}
              onChange={(e) => onColorChange("background", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Text Color */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Text Color</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.colors.text}
            onChange={(e) => onColorChange("text", e.target.value)}
            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-gray-500 transition-colors"
          />
          <div className="flex-1">
            <input
              type="text"
              value={theme.colors.text}
              onChange={(e) => onColorChange("text", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
              placeholder="#1f2937"
            />
          </div>
        </div>
      </div>

      {/* Ghost Color */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Ghost Color</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.colors.ghost}
            onChange={(e) => onColorChange("ghost", e.target.value)}
            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-gray-400 transition-colors"
          />
          <div className="flex-1">
            <input
              type="text"
              value={theme.colors.ghost}
              onChange={(e) => onColorChange("ghost", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none"
              placeholder="#f3f4f6"
            />
          </div>
        </div>
      </div>

      {/* Destructive Color */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sm font-semibold text-gray-700">Destructive Color</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={theme.colors.destructive}
            onChange={(e) => onColorChange("destructive", e.target.value)}
            className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-red-500 transition-colors"
          />
          <div className="flex-1">
            <input
              type="text"
              value={theme.colors.destructive}
              onChange={(e) => onColorChange("destructive", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="#ef4444"
            />
          </div>
        </div>
      </div>

      {/* Color Preview */}
      <div className="mt-6 p-4 rounded-xl border-2 border-gray-200 bg-white">
        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Color Preview</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md border-2 border-white mb-1"
              style={{ backgroundColor: theme.colors.primary }}
            ></div>
            <p className="text-xs text-gray-600">Primary</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md border-2 border-white mb-1"
              style={{ backgroundColor: theme.colors.secondary }}
            ></div>
            <p className="text-xs text-gray-600">Secondary</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md border-2 border-gray-300 mb-1"
              style={{ backgroundColor: theme.colors.background }}
            ></div>
            <p className="text-xs text-gray-600">Background</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md border-2 border-white mb-1"
              style={{ backgroundColor: theme.colors.text }}
            ></div>
            <p className="text-xs text-gray-600">Text</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md border-2 border-gray-200 mb-1"
              style={{ backgroundColor: theme.colors.ghost }}
            ></div>
            <p className="text-xs text-gray-600">Ghost</p>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md border-2 border-white mb-1"
              style={{ backgroundColor: theme.colors.destructive }}
            ></div>
            <p className="text-xs text-gray-600">Destructive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
