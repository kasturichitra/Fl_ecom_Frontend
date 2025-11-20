import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIndustryType } from "../../redux/industryTypeSlice";
import DynamicForm from "../../components/DynamicForm";
import FormActionButtons from "../../components/FormActionButtons";

const IndustryTypeManager = ({ onCancel }) => {
  const dispatch = useDispatch();
  const industryTypes = useSelector((state) => state.industryTypes.items);

  const tenantId = "tenant123";
  const yourToken = "TOKEN_HERE";

  const [form, setForm] = useState({
    industry_name: "",
    industry_unique_id: "",
    description: "",
    image: null,
    is_active: true,
  });

  const isEditing = false;

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const fields = [
    { key: "industry_name", label: "Industry Name", type: "text", required: true },
    { key: "industry_unique_id", label: "Unique ID", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "image", label: "Upload Image", type: "file", accept: "image/*" },
    { key: "is_active", label: "Active", type: "checkbox" },
  ];

  const [successMsg, setSuccessMsg] = useState("");
  const [failedMsg, setFailedMsg] = useState("");

  const handleAddIndustryType = async (e) => {
    e.preventDefault();

    const duplicate = industryTypes.find(
      (ind) => ind.industry_unique_id === form.industry_unique_id
    );

    if (duplicate) {
      setFailedMsg("Warning: Unique ID already exists.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      console.log(formData);
      await dispatch(
        createIndustryType({ formData, token: yourToken, tenantId })
      ).unwrap();

      setForm({
        industry_name: "",
        industry_unique_id: "",
        description: "",
        image: null,
        is_active: true,
      });

      setSuccessMsg("Industry Type added successfully!");

      setTimeout(() => handleCancel(), 800);
    } catch (err) {
      setFailedMsg(`Failed: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-10 text-center">
        <h2 className="text-4xl font-extrabold">Add New Industry Type</h2>
      </div>

      <div className="p-8 bg-gray-50">

        {/* Form Fields Only */}
        <DynamicForm
          fields={fields}
          formData={form}
          setFormData={setForm}
          // onSubmit={handleAddIndustryType}
        />

        {/* Submit / Cancel Buttons */}
        <FormActionButtons
          submitLabel="Create Industry Type"
          onClick={handleAddIndustryType}
          onCancel={handleCancel}
        />

        {/* Messages */}
        <div className="mt-8 text-center">
          {successMsg && <div className="bg-green-100 px-6 py-4 text-green-800 rounded-lg">{successMsg}</div>}
          {failedMsg && <div className="bg-red-100 px-6 py-4 text-red-800 rounded-lg">{failedMsg}</div>}
        </div>

      </div>
    </div>
  );
};

export default IndustryTypeManager;
