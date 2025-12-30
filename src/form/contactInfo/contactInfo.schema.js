import * as yup from "yup";

export const contactInfoSchema = yup.object().shape({
  email: yup
    .string()
    .required("Support email is required")
    .email("Enter a valid email address"),

  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  address: yup
    .string()
    .required("Address is required")
    .max(500, "Address cannot exceed 500 characters"),

  navbar_banner_text: yup
    .string()
    .required("Navbar Banner Text is required")
    .max(500, "Navbar Banner Text cannot exceed 500 characters"),

//   instagram_link: yup
//     .string()
//     .url("Enter a valid Instagram URL")
//     .nullable()
//     .notRequired(),

//   facebook_link: yup
//     .string()
//     .url("Enter a valid Facebook URL")
//     .nullable()
//     .notRequired(),

//   twitter_link: yup
//     .string()
//     .url("Enter a valid Twitter/X URL")
//     .nullable()
//     .notRequired(),

  about_us: yup
    .string()
    .required("About Us is required")
    .max(2000, "About Us cannot exceed 2000 characters"),

  terms_and_conditions: yup
    .string()
    .required("Terms & Conditions are required")
    .max(3000, "Terms & Conditions cannot exceed 3000 characters"),

  privacy_policy: yup
    .string()
    .required("Privacy Policy is required")
    .max(3000, "Privacy Policy cannot exceed 3000 characters"),

//   logo_image: yup
//     .mixed()
//     .nullable()
//     .test("fileType", "Only image files are allowed", (value) => {
//       if (!value) return true;            // optional
//       if (typeof value === "string") return true; // existing image URL
//       return value instanceof File && value.type.startsWith("image/");
//     }),

   welcome_message : yup
    .string()
    .required("Welcome Message is required")
    .max(500, "Welcome Message cannot exceed 500 characters"),

    business_name : yup
    .string()
    .required("Business Name is required")
    .max(500, "Business Name cannot exceed 500 characters"),
});
