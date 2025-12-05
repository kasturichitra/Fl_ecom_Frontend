import { useState } from "react";
import { FaPalette, FaFont, FaSave, FaCheckCircle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

const ThemeManager = () => {
  // Single theme state - only one theme can be saved
  const [savedTheme, setSavedTheme] = useState(null);

  // Form state for theme configuration
  const [theme, setTheme] = useState({
    colors: {
      primary: "#4f46e5",
      secondary: "#9333ea",
      background: "#ffffff",
      text: "#1f2937",
    },
    typography: {
      font_family: "Inter",
      heading_size: 32,
      body_size: 16,
    },
  });

  // Popular fonts from Google Fonts
  const popularFonts = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Nunito",
    "Work Sans",
    "Playfair Display",
    "Merriweather",
    "Source Sans Pro",
  ];

  // Handle color changes
  const handleColorChange = (colorType, value) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value,
      },
    }));
    console.log(`${colorType} color changed to:`, value);
  };

  // Handle typography changes
  const handleTypographyChange = (field, value) => {
    setTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [field]: field === "font_family" ? value : Number(value),
      },
    }));
    console.log(`Typography ${field} changed to:`, value);
  };

  // Save the theme
  const handleSaveTheme = () => {
    setSavedTheme({
      ...theme,
      savedAt: new Date().toLocaleString(),
    });
    console.log("Saved Theme:", {
      ...theme,
      savedAt: new Date().toLocaleString(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <PageHeader
            title="Theme Manager"
            subtitle="Customize your application's theme settings"
            actionLabel="Save Theme"
            onAction={handleSaveTheme}
          />

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Colors */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-6">
                    <FaPalette className="text-indigo-600 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">Color Settings</h2>
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
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-indigo-500 transition-colors"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={theme.colors.primary}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
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
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                        className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-purple-500 transition-colors"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={theme.colors.secondary}
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
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
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-blue-500 transition-colors"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={theme.colors.background}
                          onChange={(e) => handleColorChange("background", e.target.value)}
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
                        onChange={(e) => handleColorChange("text", e.target.value)}
                        className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 shadow-sm hover:border-gray-500 transition-colors"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={theme.colors.text}
                          onChange={(e) => handleColorChange("text", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="mt-6 p-4 rounded-xl border-2 border-gray-200 bg-white">
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Color Preview</p>
                    <div className="grid grid-cols-4 gap-2">
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Typography */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-6">
                    <FaFont className="text-purple-600 text-2xl" />
                    <h2 className="text-2xl font-bold text-gray-800">Typography Settings</h2>
                  </div>

                  {/* Font Family */}
                  <div className="mb-5">
                    <label className="block mb-2">
                      <span className="text-sm font-semibold text-gray-700">Font Family</span>
                    </label>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {popularFonts.map((font) => (
                        <button
                          key={font}
                          onClick={() => handleTypographyChange("font_family", font)}
                          className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                            theme.typography.font_family === font
                              ? "bg-purple-600 text-white shadow-lg scale-105"
                              : "bg-white text-gray-800 hover:bg-purple-100 shadow-sm border border-gray-200"
                          }`}
                        >
                          <span className="font-semibold text-sm">{font}</span>
                          <p
                            className={`text-xs mt-1 ${
                              theme.typography.font_family === font ? "text-purple-100" : "text-gray-500"
                            }`}
                            style={{ fontFamily: font }}
                          >
                            The quick brown fox jumps
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Heading Size */}
                  <div className="mb-5">
                    <label className="block mb-2">
                      <span className="text-sm font-semibold text-gray-700">Heading Size (px)</span>
                    </label>
                    <input
                      type="number"
                      value={theme.typography.heading_size}
                      onChange={(e) => handleTypographyChange("heading_size", e.target.value)}
                      min="16"
                      max="72"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="32"
                    />
                  </div>

                  {/* Body Size */}
                  <div className="mb-5">
                    <label className="block mb-2">
                      <span className="text-sm font-semibold text-gray-700">Body Size (px)</span>
                    </label>
                    <input
                      type="number"
                      value={theme.typography.body_size}
                      onChange={(e) => handleTypographyChange("body_size", e.target.value)}
                      min="12"
                      max="24"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="16"
                    />
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
                      This is body text preview. The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Theme Display */}
            {savedTheme && (
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-green-600 text-2xl" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Current Active Theme</h3>
                    <p className="text-sm text-gray-600">Saved on {savedTheme.savedAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Saved Colors */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Colors</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Primary:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-200"
                            style={{ backgroundColor: savedTheme.colors.primary }}
                          ></div>
                          <span className="text-sm font-mono text-gray-800">{savedTheme.colors.primary}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Secondary:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-200"
                            style={{ backgroundColor: savedTheme.colors.secondary }}
                          ></div>
                          <span className="text-sm font-mono text-gray-800">{savedTheme.colors.secondary}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Background:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-200"
                            style={{ backgroundColor: savedTheme.colors.background }}
                          ></div>
                          <span className="text-sm font-mono text-gray-800">{savedTheme.colors.background}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Text:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-200"
                            style={{ backgroundColor: savedTheme.colors.text }}
                          ></div>
                          <span className="text-sm font-mono text-gray-800">{savedTheme.colors.text}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Saved Typography */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Typography</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Font Family:</span>
                        <span
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: savedTheme.typography.font_family }}
                        >
                          {savedTheme.typography.font_family}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Heading Size:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {savedTheme.typography.heading_size}px
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Body Size:</span>
                        <span className="text-sm font-semibold text-gray-800">{savedTheme.typography.body_size}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
      `}</style>
    </div>
  );
};

export default ThemeManager;
