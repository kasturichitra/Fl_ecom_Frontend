import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { brandSchema } from "./brands.schema";
import DynamicForm from "../../components/DynamicForm";
import CategorySelector from "../../components/CategorySelector";

const BrandForm = ({
  fields,
  categories,
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting,
  additionalContent,
  className,
  shouldReset = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(brandSchema),
    defaultValues,
    mode: "onBlur",
  });

  const formData = watch();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    if (shouldReset) {
      reset(defaultValues);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <CategorySelector
        categories={categories}
        selected={formData?.categories}
        setSelected={(values) => setValue("categories", values, { shouldValidate: true })}
        errors={{ categories: errors.categories?.message }}
      />

      <DynamicForm
        fields={fields}
        formData={formData}
        setFormData={(updater) => {
          const currentData = getValues();
          const newData = typeof updater === "function" ? updater(currentData) : updater;
          Object.keys(newData).forEach((key) => {
            if (newData[key] !== currentData[key]) {
              setValue(key, newData[key], { shouldValidate: true });
            }
          });
        }}
        register={register}
        control={control}
        errors={errors}
      />

      {additionalContent}
    </form>
  );
};

export default BrandForm;
