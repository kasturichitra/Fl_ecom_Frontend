import * as yup from "yup";

export const saleTrendSchema = yup.object().shape({
    trend_name: yup
        .string()
        .required("Trend Name is required")
        .trim()
        .min(2, "Trend Name must be at least 2 characters")
        .max(100, "Trend Name cannot exceed 100 characters"),

    trend_from: yup
        .date()
        .required("Start Date is required")
        .typeError("Please enter a valid date"),

    trend_to: yup
        .date()
        .required("End Date is required")
        .typeError("Please enter a valid date")
        .min(yup.ref('trend_from'), "End Date must be after Start Date"),
});
