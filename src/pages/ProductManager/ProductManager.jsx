import { useEffect, useRef, useState } from "react";
import AttributeRepeater from "../../components/AttributeRepeater";
import FormActionButtons from "../../components/FormActionButtons";
import ScrollWrapper from "../../components/ui/ScrollWrapper";
import { PRODUCT_STATIC_FIELDS } from "../../constants/productFields";
import { useGetAllBrands } from "../../hooks/useBrand";
import { useGetAllCategories, useGetCategoryByUniqueId } from "../../hooks/useCategory";
import { useCreateProduct } from "../../hooks/useProduct";
import { objectToFormData } from "../../utils/ObjectToFormData";
import ProductForm from "../../form/products/productForm";

const ProductManager = ({ onCancel }) => {
  // Ref to get attributes from AttributeRepeater
  const attributesRef = useRef([]);

  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { data: categories } = useGetAllCategories({
    search: categorySearchTerm,
  });

  const { data: brands } = useGetAllBrands({
    searchTerm: brandSearchTerm,
  });

  const { data: selectedCategoryItem } = useGetCategoryByUniqueId(selectedCategory);

  const selectedCategoryAttributes = selectedCategoryItem?.attributes || [];

  // Prepare DB attributes (stateless list used by AttributeRepeater)
  const dbAttributes = selectedCategoryAttributes.map((attr) => ({
    attribute_code: attr.code,
    value: "",
    placeholderValue: `Enter ${attr.name}`,
    type: "text",
  }));

  // Initialize attributesRef with the pre-defined DB attributes
  useEffect(() => {
    attributesRef.current = dbAttributes.map((a) => ({
      attribute_code: a.attribute_code,
      value: a.value || "",
    }));
  }, [dbAttributes]);

  const formattedCategories = categories?.data?.map((cat) => ({
    value: cat.category_unique_id,
    label: cat.category_name,
  }));

  const formattedBrands = brands?.data?.map((brand) => ({
    value: brand.brand_unique_id,
    label: brand.brand_name,
  }));

  const { mutateAsync: createProduct, isPending: isSubmitting } = useCreateProduct({
    onSuccess: () => {
      onCancel();
    }
  });

  // --------------------------
  // PRODUCT FIELD LIST
  // --------------------------
  const productFields = [
    {
      key: "category_unique_id",
      label: "Category Unique ID *",
      type: "search",
      onSearch: (searchTerm) => {
        setCategorySearchTerm(searchTerm);
        setShowCategoryDropdown(true);
      },
      results: showCategoryDropdown ? formattedCategories : [],
      clearResults: () => {
        setCategorySearchTerm("");
        setShowCategoryDropdown(false);
      },
      onSelect: (value) => {
        setSelectedCategory(value.value);
      },
      placeholder: "e.g., HF1",
    },
    {
      key: "brand_unique_id",
      label: "Brand Unique ID *",
      type: "search",
      onSearch: (searchTerm) => {
        setBrandSearchTerm(searchTerm);
        setShowBrandDropdown(true);
      },
      results: showBrandDropdown ? formattedBrands : [],
      clearResults: () => {
        setBrandSearchTerm("");
        setShowBrandDropdown(false);
      },
      onSelect: (value) => {
        // No additional action needed, react-hook-form handles the valu
        setBrandSearchTerm("");
        setShowBrandDropdown(false);
      },
      placeholder: "e.g., apple1",
    },
    ...PRODUCT_STATIC_FIELDS,
  ];

  // CALLBACK: Update attributes ref
  const handleAttributesChange = (attributes) => {
    attributesRef.current = attributes;
  };

  // FORM SUBMIT
  const handleSubmit = async (formData) => {
    // Get current attributes from the ref
    const currentAttributes = attributesRef.current;

    // Filter out empty attributes and format them according to schema
    const validAttributes = currentAttributes
      .filter((attr) => attr.attribute_code && attr.value)
      .map((attr) => ({
        attribute_code: attr.attribute_code,
        value: attr.value,
      }));

    const { product_image, product_attributes, ...rest } = formData;

    const formDataToSend = objectToFormData(rest);
    formDataToSend.append("product_image", product_image);
    formDataToSend.append("product_attributes", JSON.stringify(validAttributes));
    
    await createProduct(formDataToSend);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <ScrollWrapper maxHeight="800px">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>
          <p className="text-gray-600 mt-2">Fill the required fields to create a product.</p>
        </div>

        <ProductForm
          fields={productFields}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          className="grid grid-cols-2 max-w-6xl"
          additionalContent={
            <>
              {/* Attribute Repeater - automatically shows DB attributes + allows custom ones */}
              <AttributeRepeater 
                label="Product Attributes" 
                predefined={dbAttributes} 
                onChange={handleAttributesChange} 
              />

              {/* Form Action Buttons */}
              <FormActionButtons
                onCancel={onCancel}
                submitLabel={isSubmitting ? "Creating..." : "Create Product"}
                disabled={isSubmitting}
              />
            </>
          }
        />
      </ScrollWrapper>
    </div>
  );
};

export default ProductManager;
