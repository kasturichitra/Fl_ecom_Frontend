// src/components/CategoryEditModal.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicForm from "../../components/DynamicForm";
import EditModalLayout from "../../components/EditModalLayout";
import { updateCategory } from "../../redux/categorySlice";

import { useGetAllIndustries } from "../../hooks/useIndustry";
import { useCategoryUpdate } from "../../hooks/useCategory";
import { updateCategoryApi } from "../../ApiServices/categoryService";

const CategoryEditModal = ({ category, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: industryTypes } = useGetAllIndustries({
    search: searchTerm,
  });

  const { mutateAsync: updateCategory, isPending: isLoading } = useCategoryUpdate();

  // ------------------------------
  // MAIN FORM DATA
  // ------------------------------

  const [formData, setFormData] = useState({
    category_name: "",
    category_unique_id: "",
    industry_unique_id: "",
    is_active: true,
    image: null,
    currentImage: null,
  });

  const [attributes, setAttributes] = useState([]);

  // Load Category Data into Form
  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name,
        category_unique_id: category.category_unique_id,
        industry_unique_id: category.industry_unique_id,
        is_active: category.is_active,
        image: null,
        currentImage: category.image ? `${import.meta.env.VITE_API_URL}/${category.image}` : null,
      });

      setAttributes(
        (category.attributes || []).map((a) => ({
          name: a.name,
          code: a.code,
          slug: a.slug,
          description: a.description,
          units: a.units || "N/A",
          is_active: a.is_active,
          _id: a._id,
        }))
      );
    }
  }, [category]);

  // ------------------------------
  // REMOVE IMAGE
  // ------------------------------
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "REMOVE",
      currentImage: null,
    }));
  };

  // ------------------------------
  // ATTRIBUTES METHODS
  // ------------------------------

  const handleAttributeChange = (index, key, value) => {
    setAttributes((prev) => {
      const updated = [...prev];
      updated[index][key] = value;

      if (key === "name") {
        updated[index].slug = value.toLowerCase().trim().replace(/\s+/g, "-");
      }

      return updated;
    });
  };

  const addAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      {
        name: "",
        code: "",
        slug: "",
        description: "",
        units: "N/A",
        is_active: true,
        _id: null,
      },
    ]);
  };

  const deleteAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------------------
  // SUBMIT HANDLER
  // ------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("category_name", formData.category_name);
    fd.append("category_unique_id", formData.category_unique_id);
    fd.append("industry_unique_id", formData.industry_unique_id);
    fd.append("is_active", formData.is_active);

    // Image logic
    if (formData.image && formData.image !== "REMOVE") {
      fd.append("image", formData.image);
    }
    if (formData.image === "REMOVE") {
      fd.append("remove_image", "true");
    }

    // Attributes
    attributes.forEach((attr, i) => {
      Object.entries(attr).forEach(([key, value]) => {
        if (value !== null) fd.append(`attributes[${i}][${key}]`, value);
      });
    });

    await updateCategory({ uniqueId: category.category_unique_id, payload: fd });
  };

  // ------------------------------
  // DYNAMIC FORM FIELDS
  // ------------------------------

  // Format accordingly how the dynamic form is expecting
  const formattedIndustryTypes = industryTypes?.map((i) => ({
    label: `${i.industry_name} #${i.industry_unique_id}`,
    value: i.industry_unique_id,
  }));

  const dynamicFields = [
    {
      key: "industry_unique_id",
      label: "Industry",
      type: "search",
      onSearch: (searchTerm) => {
        setSearchTerm(searchTerm);
        setShowDropdown(true);
      },
      results: showDropdown ? formattedIndustryTypes : [],
      clearResults: () => {
        setSearchTerm("");
        setShowDropdown(false);
      },
      onSelect: (value) => setFormData((prev) => ({ ...prev, industry_unique_id: value.value })),
      options: formattedIndustryTypes,
    },
    {
      key: "category_name",
      label: "Category Name",
      type: "text",
      required: true,
    },
    {
      key: "category_unique_id",
      label: "Category Unique ID",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      key: "image",
      label: "Category Image",
      type: "file",
      accept: "image/*",
      onRemove: removeImage,
    },
    {
      key: "is_active",
      label: "Active Category",
      type: "checkbox",
    },
  ];

  // ------------------------------
  // RENDER
  // ------------------------------

  return (
    <EditModalLayout
      title="Edit Category"
      closeModal={onClose}
      onSubmit={handleSubmit}
      submitLabel="Update Category"
      isLoading={isLoading}
      width="max-w-5xl"
    >
      {/* Top Form */}
      <DynamicForm fields={dynamicFields} formData={formData} setFormData={setFormData} />

      {/* ATTRIBUTE SECTION */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Attributes</h3>
          <button
            type="button"
            onClick={addAttribute}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            + Add Attribute
          </button>
        </div>

        <div className="space-y-6">
          {attributes.map((attr, idx) => (
            <div key={idx} className="border p-6 rounded-xl bg-gray-50 shadow-sm">
              <div className="flex justify-between mb-4">
                <h4 className="font-semibold text-indigo-700">Attribute #{idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => deleteAttribute(idx)}
                  className="text-red-600 hover:text-red-800 font-bold text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Name"
                  value={attr.name}
                  onChange={(e) => handleAttributeChange(idx, "name", e.target.value)}
                  className="border p-3 rounded-lg"
                />

                <input
                  placeholder="Code"
                  value={attr.code}
                  onChange={(e) => handleAttributeChange(idx, "code", e.target.value)}
                  className="border p-3 rounded-lg"
                />

                <input
                  placeholder="Units"
                  value={attr.units}
                  onChange={(e) => handleAttributeChange(idx, "units", e.target.value)}
                  className="border p-3 rounded-lg"
                />

                <input
                  placeholder="Description"
                  value={attr.description}
                  onChange={(e) => handleAttributeChange(idx, "description", e.target.value)}
                  className="border p-3 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  checked={attr.is_active}
                  onChange={(e) => handleAttributeChange(idx, "is_active", e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Active Attribute</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </EditModalLayout>
  );
};

export default CategoryEditModal;
