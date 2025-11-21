const DynamicForm = ({
  fields = [],
  formData,
  setFormData,
}) => {
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-2">

          <label className="font-semibold text-gray-700">{field.label}</label>

          {field.type === "text" && (
            <input
              type="text"
              value={formData[field.key] || ""}
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`border p-3 rounded-lg w-full ${
                field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              rows={field.rows || 4}
              value={formData[field.key] || ""}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          )}

          {field.type === "checkbox" && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData[field.key] || false}
                onChange={(e) => handleChange(field.key, e.target.checked)}
              />
              <span>{field.label}</span>
            </label>
          )}

          {field.type === "file" && (
            <div>
              <input
                type="file"
                accept={field.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (field.onChange) field.onChange(file); 
                  handleChange(field.key, file);
                }}
              />

              {formData.currentImage && field.key === "image" && (
                <img
                  src={formData.currentImage}
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          )}

          {field.type === "select" && (
            <select
              className="border p-3 rounded-lg"
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
            >
              <option value="">Select</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* ⭐ NEW: SEARCH FIELD */}
          {field.type === "search" && (
            <div className="relative">

              {/* ⭐ NEW: Search input */}
              <input
                type="text"
                value={formData[field.key] || ""}
                placeholder={field.placeholder || "Search..."}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange(field.key, value);

                  // ⭐ NEW: Trigger callback to fetch results
                  if (field.onSearch) field.onSearch(value);
                }}
                className="border p-3 rounded-lg w-full"
              />

              {/* ⭐ NEW: Dropdown for results */}
              {field.results?.length > 0 && (
                <div className="absolute mt-1 left-0 right-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">

                  {field.results.map((item) => (
                    <div
                      key={item.value}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleChange(field.key, item.label);

                        // ⭐ NEW: optional callback when user selects an item
                        if (field.onSelect) field.onSelect(item);

                        // ⭐ Clear results after selection
                        if (field.clearResults) field.clearResults();
                      }}
                    >
                      {item.label}
                    </div>
                  ))}

                </div>
              )}
            </div>
          )}
          {/* ⭐ END SEARCH FIELD */}

        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
