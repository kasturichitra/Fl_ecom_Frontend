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
  } = useForm({
    resolver: yupResolver(industryTypeSchema),
    defaultValues: industryDefaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  const formData = watch();

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

export default IndustryTypeForm;
