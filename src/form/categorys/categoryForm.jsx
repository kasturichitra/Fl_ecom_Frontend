import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoryDefaultValues } from "./category.default.js";
import DynamicForm from "../../components/DynamicForm.jsx";
import { categorySchema } from "./category.Schema.js";

const CategoryForm = ({
  fields = [],
  onSubmit,
  onCancel,
  isSubmitting,
  additionalContent = null,
  className
}) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: categoryDefaultValues,
    mode: "onBlur",
  });

  const formData = watch();

  const setFormData = (updater) => {
    const newData = typeof updater === "function"
      ? updater(formData)
      : updater;

    Object?.keys(newData)?.forEach((key) => {
      setValue(key, newData[key], { shouldValidate: true });
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      <DynamicForm
        fields={fields}
        formData={formData}
        setFormData={setFormData}
        register={register}
        errors={errors}
        control={control}
        className={className}
      />

      {/* Render additional items like action buttons */}
      {additionalContent}
    </form>
    </>
  );
};

export default CategoryForm;
