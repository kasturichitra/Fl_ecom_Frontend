import * as yup from "yup";

export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),

  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),

  phone_number: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
