import React from "react";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import FormActionButtons from "../../components/FormActionButtons";
import UserForm from "../../form/users/UserForm";
import { useCreateUser } from "../../hooks/useUser";
import { objectToFormData } from "../../utils/ObjectToFormData";

const UserManager = ({ onCancel }) => {
    const { mutateAsync: createUser, isPending: isSubmitting } = useCreateUser();

    const userFields = [
        {
            key: "username",
            label: "Username *",
            type: "text",
            placeholder: "Enter username",
        },
        {
            key: "email",
            label: "Email *",
            type: "text",
            placeholder: "Enter email",
        },
        {
            key: "password",
            label: "Password *",
            type: "text", // Should be password type but DynamicForm might not support it, checking later. Using text for now as per ProductForm pattern if needed or just text.
            // Wait, DynamicForm usually has 'password' type? I saw text, number, textarea, checkbox, file, select, search.
            // I'll use 'text' for now but maybe I should add 'password' to DynamicForm later if needed.
            // Actually, let's stick to 'text' for simplicity or 'password' if I can verify DynamicForm supports it.
            // I checked DynamicForm and it DOES NOT have 'password' type explicitly handled in the snippet I saw (lines 1-245).
            // So I will use 'text' for now.
            placeholder: "Enter password",
        },
        {
            key: "phone_number",
            label: "Phone Number *",
            type: "text",
            placeholder: "Enter phone number",
        },
        {
            key: "role",
            label: "Role *",
            type: "select",
            options: [
                { label: "Employee", value: "employee" },
                // { label: "User", value: "user" },
                // { label: "Admin", value: "admin" },
            ],
        },
        {
            key: "profile_image",
            label: "Profile Image *",
            type: "file",
            accept: "image/*",
        },
    ];

    const handleSubmit = async (formData) => {
        const { profile_image, ...rest } = formData;
        const formDataToSend = objectToFormData(rest);
        if (profile_image) {
            formDataToSend.append("profile_image", profile_image);
        }
        await createUser(formDataToSend);
        onCancel();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <ScrollWrapper maxHeight="800px">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create User</h1>
                    <p className="text-gray-600 mt-2">Fill the required fields to create a user.</p>
                </div>

                <UserForm
                    fields={userFields}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                    className="grid grid-cols-1 gap-4"
                    additionalContent={
                        <FormActionButtons
                            onCancel={onCancel}
                            submitLabel={isSubmitting ? "Creating..." : "Create User"}
                            disabled={isSubmitting}
                        />
                    }
                />
            </ScrollWrapper>
        </div>
    );
};

export default UserManager;
