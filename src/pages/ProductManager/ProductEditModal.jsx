import { useEffect, useState, useMemo, useRef } from "react";
import EditModalLayout from "../../components/EditModalLayout";
import DynamicForm from "../../components/DynamicForm";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useUpdateProduct } from "../../hooks/useProduct";
import { PRODUCT_STATIC_FIELDS } from "../../constants/productFields";
import AttributeRepeater from "../../components/AttributeRepeater";
import toBase64 from "../../utils/toBase64";

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
    product_images: [],
    currentImage: null,
    base_price: "",
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


  console.log("product", product)
  console.log("product_image", product?.product_image?.["low"])

  // Map product.product_attributes to the AttributeRepeater 'predefined' format
  const productDbAttributes = useMemo(
    () =>
      (product?.product_attributes || [])?.map((attr) => ({
        attribute_code: attr?.attribute_code || attr?.code || "",
        value: attr.value ?? "",
        placeholderValue: attr?.placeholderValue || `Enter ${attr?.attribute_code || attr?.code || "value"}`,
        type: attr?.type || "text",
      })),
    [product?.product_attributes]
  );

  // Initialize attributesRef.current and sync to form whenever productDbAttributes change
  useEffect(() => {
    attributesRef.current = productDbAttributes?.map((a) => ({
      attribute_code: a?.attribute_code,
      value: a?.value ?? "",
    }));
    setForm((prev) => ({ ...prev, product_attributes: attributesRef.current }));
  }, [productDbAttributes]);

  useEffect(() => {
    if (!product) return;
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

    // Path resolution helper supporting nested .low property
    const getFullUrl = (img) => {
      if (!img) return null;
      let imgStr = "";
      if (typeof img === "string") {
        imgStr = img;
      } else if (typeof img === "object") {
        // Prioritize the 'low' property as per user information, then fallbacks
        imgStr = img.low || img.url || img.image_url || img.path || img.image || img.file || "";
      }

      if (!imgStr || typeof imgStr !== "string") return null;
      if (imgStr.startsWith("http")) return imgStr;

      const path = imgStr.replace(/\\/g, "/").replace(/^\//, "");
      return `${baseUrl}/${path}`;
    };

    // Map hero image
    const heroSource = product?.product_image || product?.Product_Image || product?.image || product?.Image;
    const heroUrl = getFullUrl(heroSource);

    // Map gallery images
    const gallerySource = product?.product_images || product?.Product_Images || product?.product_gallery || product?.images || [];
    const sourceArray = Array.isArray(gallerySource)
      ? gallerySource
      : (typeof gallerySource === "string" && gallerySource.length > 0 ? gallerySource.split(",").map(s => s.trim()) : []);

    const existingGalleryUrls = sourceArray?.map(getFullUrl).filter(Boolean);

    setForm({
      category_unique_id: product?.category_unique_id ?? "",
      brand_unique_id: product?.brand_unique_id ?? "",
      product_unique_id: product?.product_unique_id ?? "",
      product_name: product?.product_name ?? "",
      product_description: product?.product_description ?? "",
      product_color: product?.product_color ?? "",
      product_size: product?.product_size ?? "",
      product_image: null,
      product_images: existingGalleryUrls,
      currentImage: heroUrl,
      base_price: product?.base_price ?? product?.price ?? "",
      discount_percentage: product?.discount_percentage ?? 0,
      cgst: product?.cgst ?? 0,
      sgst: product?.sgst ?? 0,
      igst: product?.igst ?? 0,
      stock_quantity: product?.stock_quantity ?? "",
      min_order_limit: product?.min_order_limit ?? "",
      gender: product?.gender ?? "",
      product_attributes: attributesRef?.current,
    });
  }, [product?.product_unique_id || product]);

  // format dropdowns
  const formattedCategories = categories?.data?.map((c) => ({ value: c?.category_unique_id, label: c?.category_name }));
  const formattedBrands = brands?.data?.map((b) => ({ value: b?.brand_unique_id, label: b?.brand_name }));

  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const { product_image, product_images, product_attributes, currentImage, ...rest } = form;

    // Helper to strip base64 prefix
    const cleanBase64 = (b64) => {
      if (typeof b64 !== "string") return b64;
      return b64.includes(";base64,") ? b64.split(";base64,")[1] : b64;
    };

    // Use attributesRef for the latest repeater values
    const currentAttributes = attributesRef?.current || [];
    const validAttributes = currentAttributes
      .filter((attr) => attr?.attribute_code && attr?.value !== undefined && String(attr?.value).trim() !== "")
      .map((attr) => ({
        attribute_code: attr?.attribute_code,
        value: attr?.value,
      }));

    // Process Hero Image: Only send if it's a new file
    let heroImagePayload = null;
    if (product_image instanceof File) {
      const b64 = await toBase64(product_image);
      heroImagePayload = cleanBase64(b64);
    }

    // Process Gallery Images: Only send the new ones
    let productImagesPayload = [];
    if (Array.isArray(product_images)) {
      productImagesPayload = await Promise.all(
        product_images.map(async (item) => {
          if (item instanceof File) {
            const b64 = await toBase64(item);
            return cleanBase64(b64);
          }
          return null; // Don't send existing URLs back as images
        })
      );
    }

    // Final Payload Structure
    const newGalleryImages = productImagesPayload.filter(Boolean);
    const payload = {
      ...rest,
      product_attributes: JSON.stringify(validAttributes),
      // Only include these keys if there is actually new data to upload
      ...(heroImagePayload && { product_image: heroImagePayload }),
      ...(newGalleryImages.length > 0 && { product_images: newGalleryImages }),
    };

    await updateProduct({ uniqueId: product?.product_unique_id, payload });
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
      onSelect: (value) => setForm((prev) => ({ ...prev, brand_unique_id: value?.value })),
      placeholder: "e.g., apple1",
    },
    // use the shared static fields, with a small override for edit mode
    ...PRODUCT_STATIC_FIELDS?.map((field) => {
      // enable field but disable user editing
      if (field?.key === "product_unique_id") {
        return { ...field, disabled: true, required: false };
      }

      // image not required on edit
      if (field.key === "product_image") {
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
    const mapped = items?.map((it) => ({
      attribute_code: it?.attribute_code,
      value: it?.value,
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
