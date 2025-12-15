import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "./signup.schema";

const SignupForm = ({ onSubmit, onCancel, defaultValues, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues,
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Username */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          {...register("username")}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="Enter your name"
        />
        <p className="text-red-500 text-sm">{errors.username?.message}</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register("email")}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="Enter your email"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          {...register("phone_number")}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="10-digit phone number"
        />
        <p className="text-red-500 text-sm">{errors.phone_number?.message}</p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full px-4 py-3 border rounded-lg pr-12"
            placeholder="Create password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full px-4 py-3 border rounded-lg pr-12"
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>

        {confirmPassword && (
          <p
            className={`text-sm font-medium mt-1 ${
              password === confirmPassword ? "text-green-600" : "text-red-500"
            }`}
          >
            {password === confirmPassword
              ? "Passwords match ✓"
              : "Passwords do not match"}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
