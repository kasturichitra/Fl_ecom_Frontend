import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AttributeRepeater from "../../components/AttributeRepeater";
import DynamicForm from "../../components/DynamicForm";
import EditModalLayout from "../../components/EditModalLayout";
import { PRODUCT_STATIC_FIELDS, PRODUCT_UPDATE_STATIC_FIELDS } from "../../constants/productFields";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useGetAllCategories } from "../../hooks/useCategory";
import { useUpdateProduct } from "../../hooks/useProduct";
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

  const [imageFile, setImageFile] = useState(null);

  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: categories } = useGetAllCategories({ search: categorySearchTerm });
  const { data: brands } = useGetAllBrands({ search: brandSearchTerm });

  const attributesRef = useRef([]);

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
        imgStr =
          img.low || img.high || img.original || img.url || img.image_url || img.path || img.image || img.file || "";
      }

      if (!imgStr || typeof imgStr !== "string") return null;
      if (imgStr.startsWith("http")) return imgStr;

      const path = imgStr.replace(/\\/g, "/").replace(/^\//, "");
      return `${baseUrl}/${path}`;
    };

    // Map hero image
    const heroSource = product?.product_image || product?.Product_Image || product?.image || product?.Image;
    const heroUrl = getFullUrl(heroSource);

    console.log("The product is ", product);
    // Map gallery images
    const gallerySource =
      product?.product_images || product?.Product_Images || product?.product_gallery || product?.images || [];

    console.log("Gallery Source", gallerySource);
    const sourceArray = Array.isArray(gallerySource)
      ? gallerySource
      : typeof gallerySource === "string" && gallerySource.length > 0
      ? gallerySource.split(",").map((s) => s.trim())
      : [];

    const existingGalleryUrls = sourceArray?.map((s) => s.low || s.medium || s.original).filter(Boolean);
    console.log("Existing Gallery Urls", existingGalleryUrls);

    setForm({
      category_unique_id: product?.category_unique_id ?? "",
      brand_unique_id: product?.brand_unique_id ?? "",
      product_unique_id: product?.product_unique_id ?? "",
      product_name: product?.product_name ?? "",
      product_description: product?.product_description ?? "",
      product_color: product?.product_color ?? "",
      product_size: product?.product_size ?? "",
      product_image: heroUrl,
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
    setImageFile(null);
  }, [product?.product_unique_id]);

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      product_image: "REMOVE",
      currentImage: null,
    }));
    setImageFile(null);
  };

  // format dropdowns
  const formattedCategories = categories?.data?.map((c) => ({ value: c?.category_unique_id, label: c?.category_name }));
  const formattedBrands = brands?.data?.map((b) => ({ value: b?.brand_unique_id, label: b?.brand_name }));

  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // Stable onChange handler for product_images
  const handleProductImagesChange = useCallback((files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) return;

    console.log("ProductImages onChange is triggered", files);

    // files is already an array from DynamicForm when multiple is true
    const newFiles = Array.isArray(files) ? files : [files];

    setForm((prev) => {
      const existingImages = Array.isArray(prev.product_images) ? prev.product_images : [];
      // Merge existing images (URLs or Files) with new Files
      return {
        ...prev,
        product_images: [...existingImages, ...newFiles],
      };
    });
  }, []);

  // Stable onRemove handler for product_images
  const handleProductImagesRemove = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const { product_image, product_images, product_attributes, image, currentImage, ...rest } = form;

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

    // Process Hero Image: Convert imageFile to base64
    let productImageBase64 = null;
    if (imageFile instanceof File) {
      const b64 = await toBase64(imageFile);
      productImageBase64 = cleanBase64(b64);
    }

    // Check if hero image should be removed
    const hadInitialHeroImage = !!(
      product?.product_image?.low ||
      product?.product_image?.medium ||
      product?.product_image?.original ||
      product?.product_image?.url ||
      (typeof product?.product_image === "string" && product?.product_image)
    );
    const shouldRemoveHeroImage = hadInitialHeroImage && !imageFile && !form?.currentImage;

    // Process Gallery Images: Only send File objects (new images)
    let productImagesBase64 = [];
    if (Array.isArray(product_images)) {
      productImagesBase64 = await Promise.all(
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
    const newGalleryImages = productImagesBase64.filter(Boolean);
    const payload = {
      ...rest,
      product_attributes: JSON.stringify(validAttributes),
      ...(productImageBase64 && { product_image: productImageBase64 }),
      ...(shouldRemoveHeroImage && { remove_image: true }),
      ...(newGalleryImages.length > 0 && { product_images: newGalleryImages }),
    };

    await updateProduct({ uniqueId: product?.product_unique_id, payload });
    closeModal();
  };

  const productFields = useMemo(() => {
    const fields = [
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
      ...PRODUCT_UPDATE_STATIC_FIELDS?.map((field) => {
        // enable field but disable user editing
        if (field?.key === "product_unique_id") {
          return { ...field, disabled: true, required: false };
        }

        // image not required on edit - change key to "image" to match pattern
        if (field.key === "product_image") {
          return {
            ...field,
            key: "image", // Change key to match IndustryType/Brand pattern
            required: false,
            onChange: (file) => {
              if (!file) return;

              const previewUrl = URL.createObjectURL(file);

              setImageFile(file);
              setForm((prev) => ({
                ...prev,
                currentImage: previewUrl,
              }));
            },
          };
        }

        return field;
      }),
      {
        key: "product_images",
        label: "Product Images",
        type: "file",
        accept: "image/*",
        multiple: true,
        maxCount: 5,
        onChange: handleProductImagesChange,
        onRemove: handleProductImagesRemove,
      },
      // // Add product_images field manually to ensure onChange is attached
      // (() => {
      //   const originalField = PRODUCT_STATIC_FIELDS?.find(f => f.key === "product_images");
      //   if (!originalField) return null;

      //   console.log("Creating product_images field manually, handleProductImagesChange:", handleProductImagesChange);
      //   console.log("Original field:", originalField);

      //   const productImagesField = {
      //     key: originalField.key,
      //     label: originalField.label,
      //     type: originalField.type,
      //     accept: originalField.accept,
      //     multiple: originalField.multiple,
      //     maxCount: originalField.maxCount,
      //     onChange: handleProductImagesChange,
      //     onRemove: handleProductImagesRemove,
      //   };

      //   console.log("ProductImages field created manually:", productImagesField);
      //   console.log("Has onChange?", typeof productImagesField.onChange === "function");
      //   console.log("onChange function:", productImagesField.onChange);
      //   console.log("Field keys:", Object.keys(productImagesField));

      //   return productImagesField;
      // })(),
    ].filter(Boolean); // Filter out any null values from the IIFE

    // Log the product_images field to verify onChange is attached
    const productImagesField = fields.find((f) => f.key === "product_images");
    if (productImagesField) {
      console.log("Final product_images field in productFields array:", productImagesField);
      console.log("onChange type:", typeof productImagesField.onChange);
      console.log("onChange exists?", !!productImagesField.onChange);
    } else {
      console.warn("product_images field not found in fields array!");
    }

    return fields;
  }, [showDropdown, formattedCategories, formattedBrands, handleProductImagesChange, handleProductImagesRemove]);

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

  // Ensure product_images field has onChange - modify fields array directly before passing
  // Do this in render, not useMemo, to ensure handlers are fresh
  const fieldsWithOnChange = productFields.map((field) => {
    if (field.key === "product_images") {
      console.log("=== MODIFYING product_images field in render ===");
      console.log("Current field:", field);
      console.log("handleProductImagesChange:", handleProductImagesChange);
      console.log("handleProductImagesChange type:", typeof handleProductImagesChange);

      const modifiedField = {
        ...field,
        onChange: handleProductImagesChange,
        onRemove: handleProductImagesRemove,
      };

      console.log("Modified field:", modifiedField);
      console.log("Modified field onChange:", modifiedField.onChange);
      console.log("Modified field has onChange?", typeof modifiedField.onChange === "function");
      console.log("Modified field keys:", Object.keys(modifiedField));

      return modifiedField;
    }
    return field;
  });

  return (
    <EditModalLayout
      title="Edit Product"
      closeModal={closeModal}
      onSubmit={handleSubmit}
      submitLabel={isUpdating ? "Updating..." : "Update Product"}
      isLoading={isUpdating}
      width="max-w-5xl"
    >
      {console.log("Fields with on change before sent to DynamicForm:", fieldsWithOnChange)}
      <DynamicForm fields={fieldsWithOnChange} formData={form} setFormData={setForm} className="grid grid-cols-2" />

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
