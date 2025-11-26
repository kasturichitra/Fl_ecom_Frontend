import * as yup from "yup";

export const categorySchema = yup.object().shape({
  industry_unique_id: yup
    .string()
    .trim()
    .required("Industry is required"),

  category_unique_id: yup
    .string()
    .trim()
    .required("Category Unique ID is required"),

  category_name: yup
    .string()
    .trim()
    .required("Category Name is required")
    .min(2, "Category Name must be at least 2 characters")
    .max(100, "Category Name cannot exceed 100 characters"),

  image_url: yup
    .mixed()
    .required("Image is required")
    .test("fileType", "Only JPEG or PNG images are allowed", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // existing image URL
      if (value instanceof File) {
        return ["image/jpeg", "image/png"].includes(value.type);
      }
      return false;
    }),

  description: yup
    .string()
    .trim()
    .nullable()
    .max(1000, "Description cannot exceed 1000 characters"),
});
