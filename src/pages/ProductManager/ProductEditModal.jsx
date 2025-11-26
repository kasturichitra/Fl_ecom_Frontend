import { useEffect, useState, useMemo, useRef } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useUpdateProduct } from "../../hooks/useProduct";
import { PRODUCT_STATIC_FIELDS } from "../../constants/productFields";
import { objectToFormData } from "../../utils/ObjectToFormData";
import AttributeRepeater from "../../components/AttributeRepeater";

const ProductEditModal = ({ formData: product, closeModal, onSuccess }) => {
  const [form, setForm] = useState({
    category_unique_id: "",
    brand_unique_id: "",
    product_unique_id: "",
    product_name: "",
    product_description: "",
    product_color: "",
    product_size: "",
    product_image: null,
    currentImage: null,
    price: "",
    discount_percentage: "",
    cgst: "",
    sgst: "",
    igst: "",
    stock_quantity: "",
    min_order_limit: "",
    gender: "",
    product_attributes: [],
  });

  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: categories } = useGetAllCategories({ search: categorySearchTerm });
  const { data: brands } = useGetAllBrands({ search: brandSearchTerm });

  const attributesRef = useRef([]);

  // Map product.product_attributes to the AttributeRepeater 'predefined' format
  const productDbAttributes = useMemo(
    () =>
      (product?.product_attributes || []).map((attr) => ({
        attribute_code: attr.attribute_code || attr.code || "",
        value: attr.value ?? "",
        placeholderValue: attr.placeholderValue || `Enter ${attr.attribute_code || attr.code || "value"}`,
        type: attr.type || "text",
      })),
    [product?.product_attributes]
  );

  // Initialize attributesRef.current and sync to form whenever productDbAttributes change
  useEffect(() => {
    attributesRef.current = productDbAttributes.map((a) => ({
      attribute_code: a.attribute_code,
      value: a.value ?? "",
    }));
    setForm((prev) => ({ ...prev, product_attributes: attributesRef.current }));
  }, [productDbAttributes]);

  useEffect(() => {
    if (!product) return;
    // Only set once to prevent extra rerenders
    setForm({
      category_unique_id: product.category_unique_id ?? "",
      brand_unique_id: product.brand_unique_id ?? "",
      product_unique_id: product.product_unique_id ?? "",
      product_name: product.product_name ?? "",
      product_description: product.product_description ?? "",
      product_color: product.product_color ?? "",
      product_size: product.product_size ?? "",
      product_image: null,
      currentImage: product.product_images?.[0] ? `${import.meta.env.VITE_API_URL}/${product.product_images[0]}` : null,
      price: product.price ?? "",
      discount_percentage: product.discount_percentage ?? "",
      cgst: product.cgst ?? "",
      sgst: product.sgst ?? "",
      igst: product.igst ?? "",
      stock_quantity: product.stock_quantity ?? "",
      min_order_limit: product.min_order_limit ?? "",
      gender: product.gender ?? "",
      product_attributes: attributesRef.current,
    });
  }, [product]);

  // format dropdowns
  const formattedCategories = categories?.data?.map((c) => ({ value: c.category_unique_id, label: c.category_name }));
  const formattedBrands = brands?.data?.map((b) => ({ value: b.brand_unique_id, label: b.brand_name }));

  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    // No validation here
    const { product_image, product_attributes, ...rest } = form;

    // Use attributesRef for the latest repeater values
    const currentAttributes = attributesRef.current || [];
    const validAttributes = currentAttributes
      .filter((attr) => attr.attribute_code && attr.value !== undefined && String(attr.value).trim() !== "")
      .map((attr) => ({
        attribute_code: attr.attribute_code,
        value: attr.value,
      }));

    const formData = objectToFormData(rest);
    if (product_image) formData.append("product_image", product_image);
    if (validAttributes.length) formData.append("product_attributes", JSON.stringify(validAttributes));

    await updateProduct({ uniqueId: product.product_unique_id, payload: formData });

    // if (onSuccess) onSuccess();
    closeModal();
  };

  const productFields = [
    {
      key: "category_unique_id",
      label: "Category Unique ID",
      type: "search",
      onSearch: (s) => {
        setCategorySearchTerm(s);
        setShowDropdown(true);
      },
      results: showDropdown ? formattedCategories : [],
      clearResults: () => {
        setCategorySearchTerm("");
        setShowDropdown(false);
      },
      onSelect: (value) => setForm((prev) => ({ ...prev, category_unique_id: value.value })),
      placeholder: "e.g., HF1",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID",
      type: "search",
      onSearch: (s) => {
        setBrandSearchTerm(s);
        setShowDropdown(true);
      },
      results: showDropdown ? formattedBrands : [],
      clearResults: () => {
        setBrandSearchTerm("");
        setShowDropdown(false);
      },
      onSelect: (value) => setForm((prev) => ({ ...prev, brand_unique_id: value.value })),
      placeholder: "e.g., apple1",
    },
    // use the shared static fields, with a small override for edit mode
    ...PRODUCT_STATIC_FIELDS.map((field) => {
      if (field.key === "product_unique_id") {
        return { ...field, disabled: true, required: false };
      }
      if (field.key === "product_image") {
        // in edit mode we don't force re-upload
        return { ...field, required: false };
      }
      return field;
    }),
  ];

  // callback from AttributeRepeater to update product_attributes on the form
  const handleAttributesChange = (items) => {
    // Update ref
    attributesRef.current = items;
    // Keep form.product_attributes in sync for compatibility
    const mapped = items.map((it) => ({
      attribute_code: it.attribute_code,
      value: it.value,
    }));
    setForm((prev) => ({ ...prev, product_attributes: mapped }));
  };

  return (
    <EditModalLayout
      title="Edit Product"
      closeModal={closeModal}
      onSubmit={handleSubmit}
      submitLabel={isUpdating ? "Updating..." : "Update Product"}
      isLoading={isUpdating}
      width="max-w-5xl"
    >
      <DynamicForm fields={productFields} formData={form} setFormData={setForm} className="grid grid-cols-2" />

      {/* Attribute Repeater - show current DB attributes and allow adding new ones */}
      <div className="col-span-2 mt-6">
        <AttributeRepeater
          label="Product Attributes"
          // useMemo ensures stable ref unless underlying product attrs change
          predefined={productDbAttributes}
          onChange={handleAttributesChange}
        />
      </div>
    </EditModalLayout>
  );
};

export default ProductEditModal;
