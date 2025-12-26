import { Controller } from "react-hook-form";
import cn from "../utils/tailwind-cn";
import SearchDropdown from "./SearchDropdown";
// import { ImageUp } from "lucide-react";
import { FcAddImage } from "react-icons/fc";
import { MdDelete, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import compressImage from "../utils/compressImage";

/**
 * ImagePreview - Internal helper for file previews
 */
const ImagePreview = ({ item, onRemove, onMoveLeft, onMoveRight, showArrows }) => {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  useEffect(() => {
    if (!item) return;

    if (typeof item === "string") {
      setPreview(item);
      const parts = item.split("/");
      setFileName(parts[parts.length - 1].split("?")[0]);
      return;
    }

    if (item instanceof File) {
      const url = URL.createObjectURL(item);
      setPreview(url);
      setFileName(item.name);
      setFileSize((item.size / 1024).toFixed(1) + " KB");
      return () => URL.revokeObjectURL(url);
    }
  }, [item]);

  if (!preview) return null;

  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className="relative w-24 h-24">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm transition-all group-hover:shadow-md group-hover:border-gray-300"
        />

        {/* Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 
                     transition-transform shadow-lg hover:bg-red-700 hover:scale-110 z-10"
          title="Remove image"
        >
          <MdDelete size={16} />
        </button>

        {/* Reordering Controls (Only for multiple images) */}
        {showArrows && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMoveLeft();
              }}
              className="bg-white/90 hover:bg-white text-gray-700 rounded p-0.5 shadow-sm"
              title="Move left"
            >
              <MdKeyboardArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMoveRight();
              }}
              className="bg-white/90 hover:bg-white text-gray-700 rounded p-0.5 shadow-sm"
              title="Move right"
            >
              <MdKeyboardArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center max-w-24">
        <span
          className="text-[10px] text-gray-500 truncate w-full text-center font-medium"
          title={`${fileName} ${fileSize ? `(${fileSize})` : ""}`}
        >
          {fileName}
        </span>
      </div>
    </div>
  );
};

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
  className = "",
}) => {
  const handleChange = (key, valueOrUpdater) => {
    setFormData((prev) => {
      const nextValue = typeof valueOrUpdater === "function" ? valueOrUpdater(prev[key]) : valueOrUpdater;
      return { ...prev, [key]: nextValue };
    });
  };

  const handleRemoveFile = (key, index) => {
    setFormData((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [key]: current.filter((_, i) => i !== index),
        };
      }
      return {
        ...prev,
        [key]: null,
        currentImage: null,
      };
    });
  };

  const handleMoveFile = (key, index, direction) => {
    setFormData((prev) => {
      const current = [...(prev[key] || [])];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= current.length) return prev;

      const temp = current[index];
      current[index] = current[newIndex];
      current[newIndex] = temp;

      return { ...prev, [key]: current };
    });
  };

  const handleClearAll = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [],
    }));
  };

  const [draggingField, setDraggingField] = useState(null);

  const processFiles = async (fieldKey, rawFiles) => {
    // Look up the field from the current fields array to get the latest onChange handler
    const field = fields.find((f) => f.key === fieldKey);
    if (!field) {
      return;
    }

    let files = field.multiple ? Array.from(rawFiles) : rawFiles[0] || rawFiles;
    if (!files || (Array.isArray(files) && files.length === 0)) return;

    // Apply Compression
    if (Array.isArray(files)) {
      files = await Promise.all(files.map((f) => compressImage(f)));
    } else {
      files = await compressImage(files);
    }

    // Apply Max Count Limit
    if (field.multiple && field.maxCount) {
      // Use the freshest possible count
      const currentImages = formData[field.key] || [];
      const currentCount = Array.isArray(currentImages) ? currentImages.length : 0;

      if (currentCount + files.length > field.maxCount) {
        alert(`You can only upload up to ${field.maxCount} images.`);
        files = files.slice(0, field.maxCount - currentCount);
      }
    }

    if (files.length === 0 && field.multiple) return;

    // Update State - check explicitly for function type
    if (field.onChange) {
      field.onChange(files);
    } else {
      if (field.multiple) {
        handleChange(field.key, (existing) => {
          const filesComingFromDb = Array.isArray(formData[field.key]) ? formData[field.key] : [];
          const imageUrls = filesComingFromDb.map((file) => file.low || file.original || file.medium);
          const prevList = Array.isArray(existing) ? existing : [];
          return [...prevList, ...imageUrls, ...files];
        });
      } else {
        // Clear currentImage when new file is selected and set manual preview
        const previewUrl = URL.createObjectURL(files);
        setFormData((prev) => ({
          ...prev,
          [field.key]: files,
          currentImage: previewUrl,
        }));
      }
    }
  };

  const isUsingRHF = register !== null;

  // Debug: Log fields array when component renders
  useEffect(() => {
    const productImagesField = fields.find((f) => f.key === "product_images");
  }, [fields]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {fields.map((field, fieldIndex) => {
        const fieldError = errors[field.key];
        const hasError = !!fieldError;

        const mappingKey = `${fieldIndex}-${field.key}`;
        return (
          <div
            key={mappingKey}
            className="flex flex-col gap-2"
            style={{ width: field.width ? `${field.width}px` : "100%" }} // <-- width applied here
          >
            <label className="font-semibold text-gray-700">{field.label}</label>

            {field.type === "text" && (
              <>
                <div className="flex gap-2 items-center relative">
                  <input
                    type="text"
                    {...(isUsingRHF ? register(field.key) : {})}
                    value={isUsingRHF ? undefined : formData[field.key] || ""}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={field.disabled}
                    onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                    className={cn(
                      "border p-3 rounded-lg w-full",
                      field.disabled && "bg-gray-100 cursor-not-allowed",
                      hasError && "border-red-500 focus:ring-red-500",
                      field.renderRight && "pr-24"
                    )}
                  />
                  {field.renderRight && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">{field.renderRight()}</div>
                  )}
                </div>
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "number" && (
              <>
                <input
                  type="number"
                  {...(isUsingRHF ? register(field.key, { valueAsNumber: true }) : {})}
                  value={isUsingRHF ? undefined : formData[field.key] || ""}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                  className={cn("border p-3 rounded-lg w-full", hasError && "border-red-500 focus:ring-red-500")}
                />
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "textarea" && (
              <>
                <textarea
                  rows={field.rows || 4}
                  {...(isUsingRHF ? register(field.key) : {})}
                  value={isUsingRHF ? undefined : formData[field.key] || ""}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                  className={cn("border p-3 rounded-lg w-full", hasError && "border-red-500 focus:ring-red-500")}
                />
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "date" && (
              <>
                <input
                  type="date"
                  {...(isUsingRHF ? register(field.key) : {})}
                  value={isUsingRHF ? undefined : formData[field.key] || ""}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.value)}
                  className={cn("border p-3 rounded-lg w-full", hasError && "border-red-500 focus:ring-red-500")}
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
                    checked={isUsingRHF ? undefined : formData[field.key] || false}
                    onChange={isUsingRHF ? undefined : (e) => handleChange(field.key, e.target.checked)}
                  />
                  <span>{field.label}</span>
                </label>
                {hasError && <span className="text-red-500 text-sm">{fieldError.message}</span>}
              </>
            )}

            {field.type === "file" && (
              <div className="flex flex-col gap-3">
                <label
                  htmlFor={field.key}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2",
                    "w-full min-h-[120px] border-2 border-dashed rounded-xl",
                    "cursor-pointer transition-all duration-200 group relative overflow-hidden",
                    draggingField === field.key
                      ? "border-blue-500 bg-blue-50 scale-[1.01]"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggingField(field.key);
                  }}
                  onDragLeave={() => setDraggingField(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggingField(null);
                    processFiles(field.key, e.dataTransfer.files);
                  }}
                >
                  <FcAddImage
                    size={56}
                    className={cn(
                      "transition-transform duration-300",
                      draggingField === field.key ? "scale-125" : "group-hover:scale-110"
                    )}
                  />
                  <div className="flex flex-col items-center px-4 text-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {draggingField === field.key ? "Drop images here" : "Click or Drag images to upload"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {field.multiple
                        ? `Up to ${field.maxCount || "multiple"} images (JPEG, PNG)`
                        : "One high-quality image (JPEG, PNG)"}
                    </span>
                  </div>
                  {draggingField === field.key && (
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-pulse" />
                  )}
                </label>

                <input
                  type="file"
                  accept={field?.accept}
                  onChange={(e) => {
                    processFiles(field.key, e.target.files);
                    if (isUsingRHF) {
                      register(field.key).onChange(e);
                    }
                  }}
                  className={cn(hasError && "border-red-500")}
                />

                {/* Generic Image Previews */}
                {(() => {
                  const items = formData[field.key] || formData.currentImage;
                  const displayItems = Array.isArray(items) ? items : items ? [items] : [];

                  if (displayItems.length === 0) return null;

                  return (
                    <div className="flex flex-col gap-3 mt-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {field.multiple ? "Gallery" : "Selected Image"}
                          </span>
                          {field.multiple && (
                            <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {displayItems.length} {field.maxCount ? `/ ${field.maxCount} ` : ""}
                            </span>
                          )}
                        </div>
                        {field.multiple && displayItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleClearAll(field.key)}
                            className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-tight flex items-center gap-1"
                          >
                            <MdDelete size={12} />
                            Clear All
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 py-1">
                        {displayItems.map((item, index) => (
                          <ImagePreview
                            key={index}
                            item={item}
                            showArrows={field.multiple && displayItems.length > 1}
                            onRemove={() => handleRemoveFile(field.key, index)}
                            onMoveLeft={() => handleMoveFile(field.key, index, -1)}
                            onMoveRight={() => handleMoveFile(field.key, index, 1)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {hasError && (
                  <span className="text-red-500 text-xs font-medium mt-1 ml-1">⚠ {fieldError?.message}</span>
                )}
              </div>
            )}

            {field.type === "select" && (
              <>
                <select
                  {...(isUsingRHF ? register(field.key) : {})}
                  className={cn("border p-3 rounded-lg", hasError && "border-red-500 focus:ring-red-500")}
                  value={isUsingRHF ? undefined : formData[field.key] || ""}
                  onChange={
                    isUsingRHF ? undefined : (e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                >
                  <option value="">Select</option>
                  {field.options?.map((opt, index) => (
                    <option key={index} value={opt.value}>
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
