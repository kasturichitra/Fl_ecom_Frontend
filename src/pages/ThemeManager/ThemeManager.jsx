import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useGetCurrentConfig, useUpdateConfig } from "../../hooks/useConfigs";
import ColorPicker from "../../components/configs/ColorPicker";
import TypographyPicker from "../../components/configs/TypographyPicker";

const ThemeManager = () => {
  // Single theme state - only one theme can be saved
  const [savedTheme, setSavedTheme] = useState(null);
  const { data: currentConfig } = useGetCurrentConfig();

  // console.log("currentConfig", currentConfig);

  // Form state for theme configuration
  const [theme, setTheme] = useState({
    mode: "light",
    colors: {
      primary: "#4f46e5",
      secondary: "#9333ea",
      background: "#ffffff",
      text: "#1f2937",
      ghost: "#f3f4f6",
      destructive: "#ef4444",
    },
    typography: {
      font_family: "Inter",
      heading_size: 32,
      body_size: 16,
    },
  });

  const { mutateAsync: updateConfig } = useUpdateConfig({
    onSuccess: () => {
      setSavedTheme({
        ...theme,
        savedAt: new Date().toLocaleString(),
      });
    },
  });

  // Load initial theme from config
  useEffect(() => {
    if (currentConfig?.theme) {
      setTheme({
        mode: currentConfig.theme.mode || "light",
        colors: {
          primary: currentConfig.theme.colors?.primary || "#4f46e5",
          secondary: currentConfig.theme.colors?.secondary || "#9333ea",
          background: currentConfig.theme.colors?.background || "#ffffff",
          text: currentConfig.theme.colors?.text || "#1f2937",
          ghost: currentConfig.theme.colors?.ghost || "#f3f4f6",
          destructive: currentConfig.theme.colors?.destructive || "#ef4444",
        },
        typography: {
          font_family: currentConfig.theme.typography?.font_family || "Inter",
          heading_size: currentConfig.theme.typography?.heading_size || 32,
          body_size: currentConfig.theme.typography?.body_size || 16,
        },
      });
    }
  }, [currentConfig]);

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
  const handleSaveTheme = async () => {
    if (!currentConfig?._id) {
      console.error("Config ID not found");
      return;
    }

    // Prepare data in the required format
    const themeData = {
      theme: {
        mode: theme.mode,
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          background: theme.colors.background,
          text: theme.colors.text,
          ghost: theme.colors.ghost,
          destructive: theme.colors.destructive,
        },
        typography: {
          font_family: theme.typography.font_family,
          heading_size: theme.typography.heading_size,
          body_size: theme.typography.body_size,
        },
      },
    };

    console.log("Theme data before going to API", themeData);
    // return;

    // Update config via API
    await updateConfig({
      id: currentConfig._id,
      data: themeData,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <PageHeader
            title="Theme Manager"
            subtitle="Customize your application's theme settings"
            actionLabel="Save Theme"
            createPermission="config:update"
            onAction={handleSaveTheme}
          />

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Colors */}
              <div className="space-y-6">
                <ColorPicker
                  theme={theme}
                  onColorChange={handleColorChange}
                  onModeChange={(mode) => setTheme((prev) => ({ ...prev, mode }))}
                />
              </div>

              {/* Right Column - Typography */}
              <div className="space-y-6">
                <TypographyPicker
                  theme={theme}
                  onTypographyChange={handleTypographyChange}
                  popularFonts={popularFonts}
                />
              </div>
            </div>

            {/* Saved Theme Display */}
            {savedTheme && (
              <div className="mt-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
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
                        <span className="text-sm text-gray-600">Mode:</span>
                        <span className="text-sm font-semibold text-gray-800 capitalize">{savedTheme.mode}</span>
                      </div>
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
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ghost:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-200"
                            style={{ backgroundColor: savedTheme.colors.ghost }}
                          ></div>
                          <span className="text-sm font-mono text-gray-800">{savedTheme.colors.ghost}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Destructive:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-200"
                            style={{ backgroundColor: savedTheme.colors.destructive }}
                          ></div>
                          <span className="text-sm font-mono text-gray-800">{savedTheme.colors.destructive}</span>
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
