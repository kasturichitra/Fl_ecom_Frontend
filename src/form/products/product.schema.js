import * as yup from "yup";

export const productSchema = yup.object().shape({
  // Required fields
  category_unique_id: yup.string().required("Category is required").trim(),

  brand_unique_id: yup.string().required("Brand is required").trim(),

  product_unique_id: yup
    .string()
    .required("Product Unique ID is required")
    .trim()
    .min(1, "Product Unique ID cannot be empty"),

  product_name: yup
    .string()
    .required("Product Name is required")
    .trim()
    .min(3, "Product Name must be at least 3 characters"),

  price: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Price must be a valid number")
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be greater than 0"),

  stock_quantity: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Stock Quantity must be a valid number")
    .required("Stock Quantity is required")
    .integer("Stock Quantity must be a whole number")
    .min(0, "Stock Quantity cannot be negative"),

  min_order_limit: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Minimum Order Limit must be a valid number")
    .required("Minimum Order Limit is required")
    .integer("Minimum Order Limit must be a whole number")
    .min(1, "Minimum Order Limit must be at least 1"),

  gender: yup.string().required("Gender is required").oneOf(["Unisex", "Men", "Women"], "Please select a valid gender"),

  product_image: yup
    .mixed()
    .required("Product Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // For existing images
      return value instanceof File && value.type.startsWith("image/");
    }),

  // Optional fields with validation
  product_description: yup.string().trim().max(1000, "Description cannot exceed 1000 characters").nullable(),

  product_color: yup.string().trim().max(50, "Color name cannot exceed 50 characters").nullable(),

  product_size: yup.string().trim().max(50, "Size cannot exceed 50 characters").nullable(),

  // ---- Updated nullable numeric fields ----
  discount_percentage: yup
    .number()
    .transform((value, originalValue) => {
      // treat empty or whitespace-only strings as "not provided"
      if (originalValue === "" || originalValue === null || originalValue === undefined) return undefined;
      if (typeof originalValue === "string" && originalValue.trim() === "") return undefined;
      const num = Number(originalValue);
      return isNaN(num) ? originalValue : num;
    })
    .nullable()
    .notRequired()
    .typeError("Discount must be a valid number")
    .min(0, "Discount cannot be negative")
    .max(99, "Discount cannot exceed 99%"),

  cgst: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) return undefined;
      if (typeof originalValue === "string" && originalValue.trim() === "") return undefined;
      const num = Number(originalValue);
      return isNaN(num) ? originalValue : num;
    })
    .nullable()
    .notRequired()
    .typeError("CGST must be a valid number")
    .min(0, "CGST cannot be negative")
    .max(100, "CGST cannot exceed 100%"),

  sgst: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) return undefined;
      if (typeof originalValue === "string" && originalValue.trim() === "") return undefined;
      const num = Number(originalValue);
      return isNaN(num) ? originalValue : num;
    })
    .nullable()
    .notRequired()
    .typeError("SGST must be a valid number")
    .min(0, "SGST cannot be negative")
    .max(100, "SGST cannot exceed 100%"),

  igst: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) return undefined;
      if (typeof originalValue === "string" && originalValue.trim() === "") return undefined;
      const num = Number(originalValue);
      return isNaN(num) ? originalValue : num;
    })
    .nullable()
    .notRequired()
    .typeError("IGST must be a valid number")
    .min(0, "IGST cannot be negative")
    .max(100, "IGST cannot exceed 100%"),
});
