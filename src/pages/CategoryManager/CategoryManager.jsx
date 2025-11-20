// src/pages/CategoryManager/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../redux/categorySlice";
import DynamicForm from "../../components/DynamicForm";
import FormActionButtons from "../../components/FormActionButtons";

const CategoryManager = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { items: industryTypes = [] } = useSelector((state) => state.industryTypes || {});

  const [form, setForm] = useState({
    industry_unique_id: "",
    category_unique_id: "",
    category_name: "",
    image: null,
    is_active: true,
  });

  const [attributes, setAttributes] = useState([
    { name: "", code: "", description: "", units: "", is_active: true },
  ]);

  const [showAttributes, setShowAttributes] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [failedMsg, setFailedMsg] = useState("");

  const tenantId = "tenant123";
  const token = localStorage.getItem("token") || "your-jwt-token";

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => onCancel?.(), 1500);
      return () => clearTimeout(timer);
    }
  }, [successMsg, onCancel]);

  useEffect(() => {
    if (failedMsg) {
      const timer = setTimeout(() => setFailedMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [failedMsg]);

  const addAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      { name: "", code: "", description: "", units: "", is_active: true },
    ]);
  };

  const handleAttributeChange = (index, key, value) => {
    setAttributes((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const deleteAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setFailedMsg("");

    const formData = new FormData();
    formData.append("industry_unique_id", form.industry_unique_id);
    formData.append("category_unique_id", form.category_unique_id);
    formData.append("category_name", form.category_name);
    if (form.image) formData.append("image", form.image);
    formData.append("is_active", form.is_active);
    formData.append("created_by", "Admin");
    formData.append("updated_by", "Admin");

    if (showAttributes && attributes.some((a) => a.name.trim())) {
      attributes.forEach((attr, i) => {
        if (!attr.name.trim()) return;
        formData.append(`attributes[${i}][name]`, attr.name);
        formData.append(`attributes[${i}][code]`, attr.code);
        formData.append(
          `attributes[${i}][slug]`,
          attr.name.toLowerCase().replace(/\s+/g, "-")
        );
        formData.append(`attributes[${i}][description]`, attr.description);
        formData.append(`attributes[${i}][units]`, attr.units || "N/A");
        formData.append(`attributes[${i}][is_active]`, attr.is_active);
        formData.append(`attributes[${i}][created_by]`, "Admin");
        formData.append(`attributes[${i}][updated_by]`, "Admin");
      });
    }

    dispatch(createCategory({ formData, token, tenantId }))
      .unwrap()
      .then(() => {
        setSuccessMsg(`Category "${form.category_name}" created successfully!`);
        setForm({
          industry_unique_id: "",
          category_unique_id: "",
          category_name: "",
          image: null,
          is_active: true,
        });
        setAttributes([{ name: "", code: "", description: "", units: "", is_active: true }]);
        setShowAttributes(false);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create category.";
        setFailedMsg(msg);
      });
  };

  const categoryFields = [
    {
      key: "industry_unique_id",
      label: "Select Industry",
      type: "select",
      options: industryTypes.map((ind) => ({
        value: ind.industry_unique_id,
        label: `${ind.industry_name} — ${ind.industry_unique_id}`,
      })),
      required: true,
    },
    {
      key: "category_name",
      label: "Category Name",
      type: "text",
      placeholder: "e.g. Electronics, Fashion",
      required: true,
    },
    {
      key: "category_unique_id",
      label: "Category Unique ID",
      type: "text",
      placeholder: "e.g. CAT001",
      required: true,
    },
    {
      key: "image",
      label: "Category Image",
      type: "file",
      accept: "image/*",
    },
    { key: "is_active", label: "Active", type: "checkbox" },
  ];

  return (
    <div className="bg-white max-w-4xl mx-auto border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-10">
        <h2 className="text-3xl font-bold">Add New Category</h2>
        <p className="mt-2 text-blue-100">Fill in the details to create a new category</p>
      </div>

      {/* Form Body */}
      <div className="p-8 bg-gray-50/50 max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Category Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Category Details
            </h3>
            <DynamicForm fields={categoryFields} formData={form} setFormData={setForm} />
          </div>

          {/* Attributes Section */}
          <div>
            {!showAttributes ? (
              <button
                type="button"
                onClick={() => setShowAttributes(true)}
                className="flex items-center gap-3 px-6 py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-all hover:shadow-lg"
              >
                <span className="text-2xl font-bold">+</span>
                Add Category Attributes (Optional)
              </button>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Attributes
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttributes(false);
                      setAttributes([
                        {
                          name: "",
                          code: "",
                          description: "",
                          units: "",
                          is_active: true,
                        },
                      ]);
                    }}
                    className="text-red-600 hover:text-red-700 font-medium underline"
                  >
                    Remove All
                  </button>
                </div>

                <div className="space-y-6">
                  {attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-xl p-6 bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Attribute Name (e.g. Screen Size)"
                          value={attr.name}
                          onChange={(e) =>
                            handleAttributeChange(index, "name", e.target.value)
                          }
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <input
                          type="text"
                          placeholder="Code (e.g. SCRN)"
                          value={attr.code}
                          onChange={(e) =>
                            handleAttributeChange(index, "code", e.target.value)
                          }
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={attr.description}
                          onChange={(e) =>
                            handleAttributeChange(index, "description", e.target.value)
                          }
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <input
                          type="text"
                          placeholder="Units (e.g. inches, GB)"
                          value={attr.units}
                          onChange={(e) =>
                            handleAttributeChange(index, "units", e.target.value)
                          }
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attr.is_active}
                            onChange={(e) =>
                              handleAttributeChange(index, "is_active", e.target.checked)
                            }
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 font-medium">Active</span>
                        </label>

                        {attributes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteAttribute(index)}
                            className="text-red-600 hover:text-red-700 font-medium underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addAttribute}
                  className="mt-6 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  + Add Another Attribute
                </button>
              </div>
            )}
          </div>

          {/* ⬇⬇⬇ UPDATED SECTION — ONLY CHANGE YOU ASKED FOR ⬇⬇⬇ */}
          <FormActionButtons submitLabel="Create Category" onCancel={onCancel} />
          {/* ⬆⬆⬆ NOTHING ELSE MODIFIED ⬆⬆⬆ */}

          {successMsg && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center font-semibold animate-fade">
              {successMsg}
            </div>
          )}
          {failedMsg && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg text-center font-semibold">
              {failedMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CategoryManager;
