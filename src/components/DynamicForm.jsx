import { Controller } from "react-hook-form";
import cn from "../utils/tailwind-cn";
import SearchDropdown from "./SearchDropdown";

/**
 * DynamicForm - A reusable form component that supports both controlled (react-hook-form) and uncontrolled (state-based) usage
 * 
 * @param {Array} fields - Array of field configurations
 * @param {Object} formData - Current form data
 * @param {Function} setFormData - Function to update form data
 * @param {Function} register - react-hook-form register function (optional)
 * @param {Object} errors - react-hook-form errors object (optional)
 * @param {Object} control - react-hook-form control object (optional, for Controller)
 * @param {string} className - Additional CSS classes
 */

const DynamicForm = ({ 
  fields = [], 
  formData, 
  setFormData, 
  register = null, 
  errors = {}, 
  control = null,
  className = "" 
}) => {
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isUsingRHF = register !== null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {fields.map((field) => {
        const fieldError = errors[field.key];
        const hasError = !!fieldError;

        return (
          <div
            key={field.key}
            className="flex flex-col gap-2"
            style={{ width: field.width ? `${field.width}px` : "100%" }} // <-- width applied here
          >
            <label className="font-semibold text-gray-700">{field.label}</label>

            {field.type === "text" && (
              <>
                <input
                  type="text"
                  {...(isUsingRHF ? register(field.key) : {})}
                  value={isUsingRHF ? undefined : (formData[field.key] || "")}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={field.disabled}
                  onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                  className={cn(
                    "border p-3 rounded-lg w-full",
                    field.disabled && "bg-gray-100 cursor-not-allowed",
                    hasError && "border-red-500 focus:ring-red-500"
                  )}
                />
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "number" && (
              <>
                <input
                  type="number"
                  {...(isUsingRHF ? register(field.key, { valueAsNumber: true }) : {})}
                  value={isUsingRHF ? undefined : (formData[field.key] || "")}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                  className={cn(
                    "border p-3 rounded-lg w-full",
                    hasError && "border-red-500 focus:ring-red-500"
                  )}
                />
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "textarea" && (
              <>
                <textarea
                  rows={field.rows || 4}
                  {...(isUsingRHF ? register(field.key) : {})}
                  value={isUsingRHF ? undefined : (formData[field.key] || "")}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                  className={cn(
                    "border p-3 rounded-lg w-full",
                    hasError && "border-red-500 focus:ring-red-500"
                  )}
                />
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "checkbox" && (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...(isUsingRHF ? register(field.key) : {})}
                    checked={isUsingRHF ? undefined : (formData[field.key] || false)}
                    onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.checked)}
                  />
                  <span>{field.label}</span>
                </label>
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "file" && (
              <div>
                {isUsingRHF && control ? (
                  <Controller
                    name={field.key}
                    control={control}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <input
                        type="file"
                        accept={field.accept}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                          if (field.onChange) field.onChange(file);
                        }}
                        className={cn(hasError && "border-red-500")}
                        {...rest}
                      />
                    )}
                  />
                ) : (
                  <input
                    type="file"
                    accept={field.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (field.onChange) field.onChange(file);
                      handleChange(field.key, file);
                    }}
                  />
                )}

                {formData.currentImage && field.key === "image" && (
                  <img src={formData.currentImage} className="w-32 h-32 object-cover rounded-lg mt-2" />
                )}

                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </div>
            )}

            {field.type === "select" && (
              <>
                <select
                  {...(isUsingRHF ? register(field.key) : {})}
                  className={cn(
                    "border p-3 rounded-lg",
                    hasError && "border-red-500 focus:ring-red-500"
                  )}
                  value={isUsingRHF ? undefined : (formData[field.key] || "")}
                  onChange={isUsingRHF ? undefined : (e) =>
                    setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                >
                  <option value="">Select</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "search" && (
              <>
                {isUsingRHF && control ? (
                  <Controller
                    name={field.key}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SearchDropdown
                        value={value || ""}
                        placeholder={field.placeholder}
                        results={field.results || []}
                        onChange={(val) => {
                          onChange(val);
                          if (field.onSelect) field.onSelect({ value: val });
                        }}
                        onSearch={field.onSearch}
                        onSelect={(selectedItem) => {
                          onChange(selectedItem.value);
                          if (field.onSelect) field.onSelect(selectedItem);
                        }}
                        clearResults={field.clearResults}
                      />
                    )}
                  />
                ) : (
                  <SearchDropdown
                    value={formData[field.key] || ""}
                    placeholder={field.placeholder}
                    results={field.results || []}
                    onChange={(val) => handleChange(field.key, val)}
                    onSearch={field.onSearch}
                    onSelect={field.onSelect}
                    clearResults={field.clearResults}
                  />
                )}
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
