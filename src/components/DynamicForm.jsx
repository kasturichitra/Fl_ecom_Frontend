import SearchDropdown from "./SearchDropdown";

const DynamicForm = ({ fields = [], formData, setFormData }) => {
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
              required
              type="text"
              value={formData[field.key] || ""}
              placeholder={field.placeholder}
              // required={true}
              disabled={field.disabled}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`border p-3 rounded-lg w-full ${field.disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                <img src={formData.currentImage} className="w-32 h-32 object-cover rounded-lg mt-2" />
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

          {field.type === "search" && (
            <SearchDropdown
              value={formData[field.key] || ""}
              placeholder={field.placeholder}
              results={field.results || []}
              onChange={(val) => handleChange(field.key, val)}
              onSearch={field.onSearch}
              onSelect={field.onSelect}
              clearResults={field.clearResults}
              // required={field.required}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
