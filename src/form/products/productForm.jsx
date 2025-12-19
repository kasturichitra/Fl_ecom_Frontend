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
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: productDefaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  // Watch all form values to pass to DynamicForm
  const formData = watch();

  // Handle form data changes from DynamicForm
  const setFormData = (updater) => {
    const newData = typeof updater === "function" ? updater(formData) : updater;
    Object?.keys(newData)?.forEach((key) => {
      setValue(key, newData[key], { shouldValidate: true });
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
