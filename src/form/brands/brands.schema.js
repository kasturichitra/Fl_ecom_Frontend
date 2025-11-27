import * as yup from "yup";

export const brandSchema = yup.object().shape({
  categories: yup
    .array()
    .of(yup.string().trim())
    .min(1, "At least one category must be selected")
    .required("Categories are required"),

  brand_name: yup
    .string()
    .required("Brand Name is required")
    .trim()
    .min(2, "Brand Name must be at least 2 characters")
    .max(100, "Brand Name cannot exceed 100 characters"),

  brand_unique_id: yup
    .string()
    .required("Brand Unique ID is required")
    .trim()
    .min(1, "Brand Unique ID cannot be empty"),

  brand_description: yup
    .string()
    .trim()
    .nullable()
    .max(1000, "Description cannot exceed 1000 characters"),

  brand_image: yup
    .mixed()
    .required("Brand Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // existing image URL during edit
      return value instanceof File && value.type.startsWith("image/");
    }),
});
