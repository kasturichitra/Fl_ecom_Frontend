import React from "react";
import { Link, useNavigate } from "react-router-dom";

import SignupForm from "../form/signup/SignupForm";
import { signupFormDefaults } from "../form/signup/signup.defaults";
import { useRegister } from "../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();

  const {
    mutateAsync: register,
    isPending,
  } = useRegister();

  // 🔹 submit handler (container responsibility)
  const handleSignup = async (data) => {
    const { confirmPassword, ...payload } = data;

    await register(payload);

    // redirect after success
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="w-full max-w-6xl h-full flex items-center justify-center p-4">
        <div className="w-full h-full max-h-[90vh] flex shadow-2xl rounded-3xl overflow-hidden bg-white">

          {/* Left Section – Branding */}
          <div className="w-1/2 bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img
                  src="/navLogo.png"
                  alt="Harvest Hub Logo"
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <h1 className="text-4xl font-bold text-white">Harvest Hub</h1>
            </div>

            <div className="text-center text-white space-y-4">
              <h2 className="text-3xl font-semibold">Join Our Community</h2>
              <p className="text-blue-100 text-lg max-w-md">
                Start your journey with us. Create an account to access exclusive
                features and connect with farmers worldwide.
              </p>
            </div>
          </div>

          {/* Right Section – Signup Form */}
          <div className="w-1/2 flex items-center justify-center p-4 lg:p-6 overflow-y-auto max-h-full">
            <div className="w-full max-w-md bg-white py-4">

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Fill in the details to get started
                </p>
              </div>

              {/* ✅ Reusable SignupForm */}
              <SignupForm
                defaultValues={signupFormDefaults()}
                onSubmit={handleSignup}
                isSubmitting={isPending}
              />

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
