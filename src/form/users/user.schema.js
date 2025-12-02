import * as yup from "yup";

export const userSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    phone_number: yup.string().required("Phone number is required"),
    role: yup.string().required("Role is required"),
    profile_image: yup.mixed().required("Profile image is required"),
});
