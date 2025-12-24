import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "./product.schema";
import { productDefaultValues } from "./product.defaults";
import DynamicForm from "../../components/DynamicForm";

/**
 * ProductForm - React Hook Form wrapper for the product form
 *
 * @param {Object} props
 * @param {Array} props.fields - Array of field configurations
 * @param {Function} props.onSubmit - Submit handler that receives validated form data
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isSubmitting - Whether form is currently submitting
 * @param {Object} props.additionalContent - Additional JSX to render (e.g., AttributeRepeater)
 * @param {string} props.className - Additional className for DynamicForm
 */
const ProductForm = ({
  fields = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  additionalContent = null,
  className = "",
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: productDefaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  // Watch all form values to pass to DynamicForm
  const formData = watch();

  // Handle form data changes from DynamicForm
  const setFormData = (updater) => {
    const currentValues = getValues();
    const newData = typeof updater === "function" ? updater(currentValues) : updater;

    if (!newData) return;

    // Only update keys that have actually changed to prevent race conditions and unnecessary resets
    Object.keys(newData).forEach((key) => {
      const val1 = newData[key];
      const val2 = currentValues[key];

      let isDifferent = false;
      if (Array.isArray(val1)) {
        // Deep compare arrays (simple version for this use case)
        isDifferent = JSON.stringify(val1) !== JSON.stringify(val2);

        // If they look same by stringify but one might have Files, check them
        if (!isDifferent && val1.some((v) => v instanceof File)) {
          isDifferent = val1.length !== val2.length || val1.some((v, i) => v !== val2[i]);
        }
      } else if (val1 instanceof File || val2 instanceof File) {
        isDifferent = val1 !== val2;
      } else {
        isDifferent = val1 !== val2;
      }

      if (isDifferent) {
        setValue(key, val1, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DynamicForm
        fields={fields}
        formData={formData}
        setFormData={setFormData}
        register={register}
        errors={errors}
        control={control}
        className={className}
      />

      {/* Render additional content like AttributeRepeater */}
      {additionalContent}
    </form>
  );
};

export default ProductForm;
