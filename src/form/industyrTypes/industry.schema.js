import * as yup from "yup";

export const industryTypeSchema = yup.object().shape({
    // industry_unique_id: yup
    //     .string()
    //     .required("Industry Unique ID is required")
    //     .trim()
    //     .min(1, "Industry Unique ID cannot be empty"),

    industry_name: yup
        .string()
        .required("Industry Name is required")
        .trim()
        .min(2, "Industry Name must be at least 2 characters")
        .max(100, "Industry Name cannot exceed 100 characters"),

    image_url: yup
        .mixed()
        .nullable()
        .test("fileType", "Only image files are allowed", (value) => {
            if (!value) return true; // optional
            if (typeof value === "string") return true; // existing URL
            return value instanceof File && value?.type?.startsWith("image/");
        }),

    description: yup
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters")
        .nullable(),
});
