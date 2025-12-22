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
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(brandSchema),
    defaultValues,
    mode: "onBlur",
  });

  const formData = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <CategorySelector
        categories={categories}
        selected={formData?.categories}
        setSelected={(values) => setValue("categories", values, { shouldValidate: true })}
        errors={{ categories: errors.categories?.message }}
      />

      <DynamicForm
        fields={fields}
        formData={formData}
        setFormData={(data) => Object?.keys(data)?.forEach((key) => setValue(key, data[key], { shouldValidate: true }))}
        register={register}
        control={control}
        errors={errors}
      />

      {additionalContent}
    </form>
  );
};

export default BrandForm;
