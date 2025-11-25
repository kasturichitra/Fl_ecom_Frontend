import { useEffect, useState } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useUpdateProduct } from "../../hooks/useProduct";
import { PRODUCT_STATIC_FIELDS } from "../../constants/productFields";
import { objectToFormData } from "../../utils/ObjectToFormData";

const ProductEditModal = ({ formData: product, closeModal, onSuccess }) => {
  console.log("Product in edit modal:", product);
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

  useEffect(() => {
    if (!product) return;
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
      product_attributes: product.product_attributes ?? [],
    });
  }, [product]);

  // format dropdowns
  const formattedCategories = categories?.map((c) => ({ value: c.category_unique_id, label: c.category_name }));
  const formattedBrands = brands?.map((b) => ({ value: b.brand_unique_id, label: b.brand_name }));

  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    // No validation here (removed as requested)
    try {
      const { product_image, product_attributes, ...rest } = form;

      const formData = objectToFormData(rest);
      formData.append("product_image", product_image);

      await updateProduct({ uniqueId: product.product_unique_id, payload: formData });
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
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
    </EditModalLayout>
  );
};

export default ProductEditModal;
