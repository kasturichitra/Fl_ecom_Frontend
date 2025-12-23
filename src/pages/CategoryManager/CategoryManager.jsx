// src/pages/CategoryManager/CategoryManager.jsx
import { useState, useMemo } from "react";
import CategoryForm from "../../form/categorys/categoryForm";
import FormActionButtons from "../../components/FormActionButtons";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import { useCreateCategory } from "../../hooks/useCategory";
import { useGetAllIndustries } from "../../hooks/useIndustry";
import toBase64 from "../../utils/toBase64";

const CategoryManager = ({ onCancel }) => {
  // const { items: industryTypes = [] } = useSelector((state) => state.industryTypes || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: industryTypes } = useGetAllIndustries({
    search: searchTerm,
  });

  const [attributes, setAttributes] = useState([{ name: "", code: "", description: "", units: "", is_active: true }]);

  const [showAttributes, setShowAttributes] = useState(false);

  const { mutateAsync: createCategory, isPending: isCreatingCategory } = useCreateCategory({
    onSuccess: () => {
      setAttributes([{ name: "", code: "", description: "", units: "", is_active: true }]);
      setShowAttributes(false);
      onCancel();
    },
  });

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", code: "", description: "", units: "", is_active: true }]);
  };

  const handleAttributeChange = (index, key, value) => {
    setAttributes((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const deleteAttribute = (index) => {
    setAttributes((prev) => prev?.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData) => {
    // const data = new FormData();
    // data.append("industry_unique_id", formData?.industry_unique_id);
    // data.append("category_unique_id", formData?.category_unique_id);
    // data.append("category_name", formData?.category_name);
    // console.log("Form image", formData?.image);
    // if (formData?.image) data.append("image", formData?.image);
    // data.append("is_active", formData?.is_active);
    // data.append("created_by", "Admin");
    // data.append("updated_by", "Admin");

    // if (showAttributes && attributes?.some((a) => a?.name.trim())) {
    //   attributes.forEach((attr, i) => {
    //     if (!attr?.name.trim()) return;
    //     data.append(`attributes[${i}][name]`, attr?.name);
    //     data.append(`attributes[${i}][code]`, attr?.code);
    //     data.append(`attributes[${i}][slug]`, attr?.name.toLowerCase().replace(/\s+/g, "-"));
    //     data.append(`attributes[${i}][description]`, attr?.description);
    //     data.append(`attributes[${i}][units]`, attr?.units || "N/A");
    //     data.append(`attributes[${i}][is_active]`, attr?.is_active);
    //     data.append(`attributes[${i}][created_by]`, "Admin");
    //     data.append(`attributes[${i}][updated_by]`, "Admin");
    //   });
    // }
    console.log("Payload before going to the API", formData);

    // const imageBase64 = await toBase64(payload.image_url);
    // await createIndustry({ ...payload, image_base64: imageBase64 });

    const imageBase64 = await toBase64(formData?.image);
    //  console.log({})
    // console.log("Image base64", imageBase64);
    const { image, ...rest } = formData
    await createCategory({ ...rest, image_base64: imageBase64 });
  };

  const formattedIndustryTypes = industryTypes?.data?.map((i) => ({
    label: `${i?.industry_name} #${i?.industry_unique_id}`,
    value: i?.industry_unique_id,
  }));

  const categoryFields = useMemo(() => [
    {
      key: "industry_unique_id",
      label: "Industry *",
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
      onSelect: (item) => {
        setSearchTerm(item.label);
        setShowDropdown(false);
      },
      options: formattedIndustryTypes,
    },
    {
      key: "category_name",
      label: "Category Name *",
      type: "text",
      placeholder: "e.g. Electronics, Fashion",
    },
    {
      key: "image",
      label: "Category Image *",
      type: "file",
      accept: "image/*",
    },
    { key: "is_active", label: "Active", type: "checkbox" },
  ], [formattedIndustryTypes, showDropdown]);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-xl">
      {/* Close Button */}
      <button
        onClick={onCancel}
        className="absolute right-3 top-3 md:right-5 md:top-5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <ScrollWrapper maxHeight="800px">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Category</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a new category.</p>
        </div>

        {/* Form Body */}
        <CategoryForm
          fields={categoryFields}
          onSubmit={handleSubmit}
          isSubmitting={isCreatingCategory}
          onCancel={onCancel}
          className="grid grid-cols-1 gap-4"
          additionalContent={
            <>
              {/* Attributes Section */}
              <div className="mt-6 border-t pt-6">
                {!showAttributes ? (
                  <button
                    type="button"
                    onClick={() => setShowAttributes(true)}
                    className="flex items-center gap-3 px-6 py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-all hover:shadow-lg w-full justify-center"
                  >
                    <span className="text-2xl font-bold">+</span>
                    Add Category Attributes (Optional)
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Attributes</h3>
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
                        <div key={index} className="border border-gray-300 rounded-xl p-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Attribute Name (e.g. Screen Size)"
                              value={attr?.name}
                              onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            <input
                              type="text"
                              placeholder="Code (e.g. SCRN)"
                              value={attr?.code}
                              onChange={(e) => handleAttributeChange(index, "code", e.target.value)}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={attr?.description}
                              onChange={(e) => handleAttributeChange(index, "description", e.target.value)}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            <input
                              type="text"
                              placeholder="Units (e.g. inches, GB)"
                              value={attr?.units}
                              onChange={(e) => handleAttributeChange(index, "units", e.target.value)}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                          </div>

                          <div className="flex items-center justify-between mt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attr?.is_active}
                                onChange={(e) => handleAttributeChange(index, "is_active", e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-700 font-medium">Active</span>
                            </label>

                            {attributes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => deleteAttribute(index)}
                                className="text-red-600 hover:text-red-700 font-medium underline cursor-pointer"
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
                      className="mt-6 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer w-full"
                    >
                      + Add Another Attribute
                    </button>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <FormActionButtons
                submitLabel={isCreatingCategory ? "Creating..." : "Create Category"}
                onCancel={onCancel}
                isSubmitting={isCreatingCategory}
              />
            </>
          }
        />
      </ScrollWrapper>
    </div>
  );
};

export default CategoryManager;
