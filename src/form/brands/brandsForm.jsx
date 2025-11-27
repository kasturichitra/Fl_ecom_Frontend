import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { brandSchema } from "./brands.schema";
import DynamicForm from "../../components/DynamicForm";
import CategorySelector from "../../components/CategorySelector";

const BrandForm = ({ fields, categories, onSubmit, onCancel, defaultValues, isSubmitting }) => {
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
    <>
      <CategorySelector
        categories={categories}
        selected={formData.categories}
        setSelected={(values) => setValue("categories", values, { shouldValidate: true })}
        errors={{ categories: errors.categories?.message }}
      />

      <DynamicForm
        fields={fields}
        formData={formData}
        setFormData={(data) => Object.keys(data).forEach((key) => setValue(key, data[key], { shouldValidate: true }))}
        register={register}
        control={control}
        errors={errors}
      />

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border bg-gray-200 text-gray-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default BrandForm;
