import FormActionButtons from "../../components/FormActionButtons";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import UserForm from "../../form/users/UserForm";
import { useCreateUser } from "../../hooks/useUser";
import { objectToFormData } from "../../utils/ObjectToFormData";

const EmployeeManager = ({ onCancel }) => {
  const { mutateAsync: createUser, isPending: isSubmitting } = useCreateUser();

  const employeeFields = [
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
      type: "text",
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
      disabled: true,
      options: [{ label: "Employee", value: "employee" }],
    },
    {
      key: "image",
      label: "Profile Image *",
      type: "file",
      accept: "image/*",
    },
  ];

  const handleSubmit = async (formData) => {
    const { image, ...rest } = formData;
    const formDataToSend = objectToFormData(rest);
    if (image) {
      formDataToSend.append("image", image);
    }
    await createUser(formDataToSend);
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <ScrollWrapper maxHeight="900px">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Employee</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a employee.</p>
        </div>

        <UserForm
          fields={employeeFields}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          className="grid grid-cols-1 gap-4"
          additionalContent={
            <FormActionButtons
              onCancel={onCancel}
              submitLabel={isSubmitting ? "Creating..." : "Create Employee"}
              isSubmitting={isSubmitting}
            />
          }
        />
      </ScrollWrapper>
    </div>
  );
};

export default EmployeeManager;
