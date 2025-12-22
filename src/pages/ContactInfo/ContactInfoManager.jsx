import ContactInfoForm from "../../form/contactInfo/ContactInfoForm";
import {
  useCreateContactInfo,
  useGetContactInfo,
} from "../../hooks/useContactInfo";
import { objectToFormData } from "../../utils/ObjectToFormData";

const ContactInfoManager = ({ onCancel }) => {
  /* ---------- GET EXISTING CONTACT INFO ---------- */
  const { data: contactInfo, isLoading } = useGetContactInfo();

  // console.log("contactInfo", contactInfo);

  /* ---------- PUT (CREATE / UPDATE) ---------- */
  const {
    mutateAsync: saveContactInfo,
    isPending: isSavingContactInfo,
  } = useCreateContactInfo({
    onSuccess: () => {
      onCancel?.();
    },
  });

  /* ---------- SUBMIT ---------- */
  const handleSaveContactInfo = async (formValues) => {
    console.log("formValues", formValues);
    const {logo_image, ...rest} = formValues;
    const formData = objectToFormData(rest);
    formData.append("logo_image", logo_image[0]);
    await saveContactInfo(formData); // SAME PUT for create + update
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading contact information...
      </div>
    );
  }

  return (
    <div className="bg-gray-200 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 relative">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white px-8 py-10 text-center">
        <h2 className="text-4xl font-extrabold">Contact Information</h2>
        <p className="opacity-90 mt-2">
          Manage support details, social links, and branding
        </p>
      </div>

      {/* Form */}
      <div className="p-8 bg-gray-50">
        <ContactInfoForm
          initialValues={contactInfo}   
          onSubmit={handleSaveContactInfo}
          isSubmitting={isSavingContactInfo}
          additionalContent={
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="submit"
                disabled={isSavingContactInfo}
                className="bg-linear-to-r from-indigo-600 to-purple-700 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSavingContactInfo ? "Saving..." : "Save Contact Info"}
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ContactInfoManager;
