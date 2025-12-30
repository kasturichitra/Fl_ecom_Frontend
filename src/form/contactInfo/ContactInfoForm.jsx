import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactInfoSchema } from "./contactInfo.schema";
import { contactInfoDefaultValues } from "./contactInfo.default";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { FcAddImage } from "react-icons/fc";
import { MdDelete } from "react-icons/md";


const ContactInfoForm = ({ onSubmit, isSubmitting, additionalContent = null, initialValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset, // ✅ REQUIRED
  } = useForm({
    resolver: yupResolver(contactInfoSchema),
    defaultValues: contactInfoDefaultValues,
    mode: "onBlur",
  });

  const [logoPreview, setLogoPreview] = useState(null);

  console.log("initialValues", initialValues);
  console.log("image", initialValues?.logo_image['low']);

  useEffect(() => {
    if (initialValues) {
      reset({
        ...contactInfoDefaultValues,
        ...initialValues,
      });

      // 👇 show existing logo from backend
      if (initialValues.logo_image) {
        setLogoPreview(initialValues.logo_image['low']);
      }
    }
  }, [initialValues, reset]);

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
        {/* <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Upload Logo</label>
          <input type="file" {...register("logo_image")} accept="image/*" />
          {errors?.logo_image && <p className="text-red-500 text-xs mt-1">{errors?.logo_image?.message}</p>}
        </div> */}
        {/* Logo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Upload Logo</label>

          <Controller
            name="logo_image"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="flex flex-col gap-3">
                {/* Upload Area */}
                <label
                  className="flex flex-col items-center justify-center gap-2
                     w-full min-h-[120px] border-2 border-dashed rounded-xl
                     cursor-pointer transition-all
                     border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                  <FcAddImage size={48} className="opacity-80" />
                  <span className="text-sm font-semibold text-gray-700">
                    Click or drag logo to upload
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG / JPG (recommended)
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      onChange(file); // RHF value
                      setLogoPreview(URL.createObjectURL(file)); // preview
                    }}
                  />
                </label>

                {/* Preview */}
                {logoPreview && (
                  <div className="relative w-28 h-28">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-xl border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onChange(null);
                        setLogoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white
                         rounded-full p-1.5 hover:scale-110"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          />

          {errors?.logo_image && (
            <p className="text-red-500 text-xs mt-1">
              {errors.logo_image.message}
            </p>
          )}
        </div>

      </div>

      {/* Buttons */}
      {additionalContent}
    </form>
  );
};

export default ContactInfoForm;
