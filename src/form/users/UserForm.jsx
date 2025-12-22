import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "./user.schema";
import { userDefaultValues } from "./user.defaults";
import DynamicForm from "../../components/DynamicForm";

const UserForm = ({
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
        resolver: yupResolver(userSchema),
        defaultValues: userDefaultValues,
        mode: "onBlur",
    });

    const formData = watch();

    const setFormData = (updater) => {
        const newData = typeof updater === "function" ? updater(formData) : updater;
        Object.keys(newData)?.forEach((key) => {
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
            {additionalContent}
        </form>
    );
};

export default UserForm;
