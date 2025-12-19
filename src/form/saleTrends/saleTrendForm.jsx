import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { saleTrendSchema } from "./saleTrend.schema.js";
import { saleTrendDefaultValues } from "./saleTrend.default.js";
import DynamicForm from "../../components/DynamicForm.jsx";

const SaleTrendForm = (
    { fields = [], onSubmit, onCancel, isSubmitting, additionalContent = null, className }
) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(saleTrendSchema),
        defaultValues: saleTrendDefaultValues,
        mode: "onBlur", // Validate on blur for better UX
    });

    const formData = watch();

    const setFormData = (updater) => {
        const newData = typeof updater === "function" ? updater(formData) : updater;
        Object?.keys(newData)?.forEach((key) => {
            setValue(key, newData[key], { shouldValidate: true });
        });
    };

    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        // Reset form after successful submission
        reset(saleTrendDefaultValues);
    };

    console.log("Form data", formData);

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
    )
}

export default SaleTrendForm;

