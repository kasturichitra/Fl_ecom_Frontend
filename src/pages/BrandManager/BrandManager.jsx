import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand } from "../../redux/brandSlice";

import DynamicForm from "../../components/DynamicForm";
import CategorySelector from "../../components/CategorySelector";
import FormActionButtons from "../../components/FormActionButtons";
import { objectToFormData } from "../../utils/ObjectToFormData";
import { useCreateBrand } from "../../hooks/useBrand";

const BrandManager = () => {
  const dispatch = useDispatch();

  const { mutateAsync: createBrand } = useCreateBrand();

  const categories = useSelector((state) => state.categories?.items || []);
  const token = useSelector((state) => state.auth?.token);
  const tenantId = "tenant123";

  const [form, setForm] = useState({
    categories: [],
    brand_name: "",
    brand_unique_id: "",
    brand_description: "",
    brand_image: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // -----------------------------------------
  // VALIDATE
  // -----------------------------------------
  const validate = () => {
    const e = {};

    if (!form.categories.length) e.categories = "Select at least one category";

    if (!form.brand_name.trim()) e.brand_name = "Brand name is required";

    if (!form.brand_unique_id.trim()) e.brand_unique_id = "Brand Unique ID is required";

    if (!form.brand_image) e.brand_image = "Brand image is required";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    console.error("Errors", errors);
  }, [errors]);

  // -----------------------------------------
  // SUBMIT BRAND
  // -----------------------------------------
  const handleCreateBrand = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log(form);

    const { categories, ...rest } = form;

    const formData = objectToFormData({ ...rest });
    console.log("Form categories", form.categories);

    // formData.append("categories", JSON.stringify(form.categories));

    form.categories.forEach((id) => {
      formData.append("categories[]", id);
    });

    // formData.append("categories", finalString);

    await createBrand(formData);

    setForm({
      categories: [],
      brand_name: "",
      brand_unique_id: "",
      brand_description: "",
      brand_image: null,
    });

    setImagePreview(null);
  };

  // -----------------------------------------
  // HANDLE IMAGE
  // -----------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, brand_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // -----------------------------------------
  // Dynamic Form Fields
  // -----------------------------------------
  const formFields = [
    {
      key: "brand_name",
      label: "Brand Name",
      type: "text",
      required: true,
      placeholder: "Nike, Samsung...",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID",
      type: "text",
      required: true,
      placeholder: "BR-001",
    },
    {
      key: "brand_description",
      label: "Brand Description",
      type: "textarea",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Add New Brand</h2>

      <form onSubmit={handleCreateBrand} className="space-y-6">
        {/* ---------------- Category Selector -------------- */}
        <div>
          <CategorySelector
            categories={categories}
            selected={form.categories}
            setSelected={(values) => setForm({ ...form, categories: values })}
          />
          {errors.categories && <p className="text-red-500 text-sm">{errors.categories}</p>}
        </div>

        {/* ---------------- Dynamic Form Fields -------------- */}
        <DynamicForm fields={formFields} formData={form} setFormData={setForm} errors={errors} />

        {/* ---------------- Image Upload -------------- */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Brand Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded-md" />

          {imagePreview && <img src={imagePreview} className="w-28 h-28 mt-3 rounded-md border object-cover" />}

          {errors.brand_image && <p className="text-red-500 text-sm">{errors.brand_image}</p>}
        </div>

        {/* ---------------- Action Buttons -------------- */}
        <FormActionButtons
          submitLabel="Add Brand"
          onCancel={() => {
            setForm({
              categories: [],
              brand_name: "",
              brand_unique_id: "",
              brand_description: "",
              brand_image: null,
            });
            setImagePreview(null);
          }}
        />
      </form>
    </div>
  );
};

export default BrandManager;
