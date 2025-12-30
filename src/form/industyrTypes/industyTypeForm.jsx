import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import DynamicForm from "../../components/DynamicForm.jsx";
import { industryDefaultValues } from "./industry.default.js";
import { industryTypeSchema } from "./industry.schema.js";

const IndustryTypeForm = ({ fields = [], onSubmit, onCancel, isSubmitting, additionalContent = null, className }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(industryTypeSchema),
    defaultValues: industryDefaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset(industryDefaultValues); // Reset form after successful submission
  };

  const formData = watch();

  const setFormData = (updater) => {
    const currentValues = watch(); // Get the most up-to-date form values
    const newData = typeof updater === "function" ? updater(currentValues) : updater;

    // Only update values that have actually changed
    Object?.keys(newData)?.forEach((key) => {
      if (newData[key] !== currentValues[key]) {
        setValue(key, newData[key], { shouldValidate: true });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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

export default IndustryTypeForm;
