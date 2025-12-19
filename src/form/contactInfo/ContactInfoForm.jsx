import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactInfoSchema } from "./contactInfo.schema";
import { contactInfoDefaultValues } from "./contactInfo.default";
import { useEffect } from "react";

const ContactInfoForm = ({ onSubmit, isSubmitting, additionalContent = null, initialValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // ✅ REQUIRED
  } = useForm({
    resolver: yupResolver(contactInfoSchema),
    defaultValues: contactInfoDefaultValues,
    mode: "onBlur",
  });

  /* 🔥 THIS IS THE MISSING PIECE */
  useEffect(() => {
    if (initialValues) {
      reset({
        ...contactInfoDefaultValues,
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Support Email</label>
          <input {...register("email")} className="w-full p-2 border rounded" />
          {errors?.email && <p className="text-red-500 text-xs mt-1">{errors?.email?.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input {...register("phone_number")} className="w-full p-2 border rounded" />
          {errors?.phone_number && <p className="text-red-500 text-xs mt-1">{errors?.phone_number?.message}</p>}
        </div>

        {/* Address - full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea {...register("address")} rows={3} className="w-full p-2 border rounded" />
          {errors?.address && <p className="text-red-500 text-xs mt-1">{errors?.address?.message}</p>}
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium mb-1">Instagram Link</label>
          <input {...register("instagram_link")} className="w-full p-2 border rounded" />
          {errors?.instagram_link && <p className="text-red-500 text-xs mt-1">{errors?.instagram_link?.message}</p>}
        </div >

        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium mb-1">Facebook Link</label>
          <input {...register("facebook_link")} className="w-full p-2 border rounded" />
          {errors?.facebook_link && <p className="text-red-500 text-xs mt-1">{errors?.facebook_link?.message}</p>}
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-sm font-medium mb-1">Twitter / X Link</label>
          <input {...register("twitter_link")} className="w-full p-2 border rounded" />
          {errors?.twitter_link && <p className="text-red-500 text-xs mt-1">{errors?.twitter_link?.message}</p>}
        </div>

        {/* Navbar Banner Text */}
        <div>
          <label className="block text-sm font-medium mb-1">Navbar Banner Text</label>
          <input {...register("navbar_banner_text")} className="w-full p-2 border rounded" />
          {errors?.navbar_banner_text && (
            <p className="text-red-500 text-xs mt-1">{errors?.navbar_banner_text?.message}</p>
          )}
        </div>

        {/* About Us - full */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">About Us</label>
          <textarea {...register("about_us")} rows={4} className="w-full p-2 border rounded" />
          {errors?.about_us && <p className="text-red-500 text-xs mt-1">{errors?.about_us?.message}</p>}
        </div>

        {/* Terms */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Terms & Conditions</label>
          <textarea {...register("terms_and_conditions")} rows={4} className="w-full p-2 border rounded" />
          {errors?.terms_and_conditions && (
            <p className="text-red-500 text-xs mt-1">{errors?.terms_and_conditions?.message}</p>
          )}
        </div>

        {/* Privacy */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Privacy Policy</label>
          <textarea {...register("privacy_policy")} rows={4} className="w-full p-2 border rounded" />
          {errors?.privacy_policy && <p className="text-red-500 text-xs mt-1">{errors?.privacy_policy?.message}</p>}
        </div>

        {/* Logo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Upload Logo</label>
          <input type="file" {...register("logo_image")} accept="image/*" />
          {errors?.logo_image && <p className="text-red-500 text-xs mt-1">{errors?.logo_image?.message}</p>}
        </div>
      </div>

      {/* Buttons */}
      {additionalContent}
    </form>
  );
};

export default ContactInfoForm;
