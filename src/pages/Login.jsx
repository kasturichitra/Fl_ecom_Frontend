import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { DEVICE_ID } from "../lib/constants";
import { useDeviceDetect } from "../hooks/useDeviceDetect";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // email or mobile
    password: "",
    rememberMe: false,
  });

  const deviceInfo = useDeviceDetect();
  console.log("deviceInfo", deviceInfo);
  
  const { mutateAsync: login } = useLogin();

  const [errors, setErrors] = useState({
    identifier: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Regex patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePattern = /^[0-9]{10}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Real-time validation for identifier
    if (name === "identifier") {
      if (value === "") {
        setErrors({ ...errors, identifier: "This field is required" });
      } else if (!emailPattern.test(value) && !mobilePattern.test(value)) {
        setErrors({ ...errors, identifier: "Enter a valid email or 10-digit mobile number" });
      } else {
        setErrors({ ...errors, identifier: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier) {
      setErrors({ ...errors, identifier: "This field is required" });
      return;
    }
    if (errors.identifier) return;

    try {
      // Build payload
      const payload = {
        password: formData.password,
        device_id: DEVICE_ID,
        device_name: "Web Browser",
      };

      // Send as phone_number if it's a 10-digit number, else as email
      if (mobilePattern.test(formData.identifier)) {
        payload.phone_number = formData.identifier;
      } else {
        payload.email = formData.identifier;
      }

      console.log("Login success:", payload);
      const response = await login(payload);
      console.log(response);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="w-full max-w-6xl h-full flex items-center justify-center p-4">
        <div className="w-full h-full max-h-[90vh] flex shadow-2xl rounded-3xl overflow-hidden bg-white">
          {/* Left Section - Branding */}
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
              <h2 className="text-3xl font-semibold">Welcome Back</h2>
              <p className="text-blue-100 text-lg max-w-md">
                Sign in to your account and continue your journey with us. Access your dashboard and manage your
                agricultural business.
              </p>
            </div>
            {/* Decorative elements */}
            <div className="mt-12 space-y-6 w-full max-w-sm">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm">Lightning Fast Access</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm">Connect with Community</span>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-1/2 flex items-center justify-center p-4 lg:p-6 overflow-y-auto max-h-full">
            <div className="w-full max-w-md bg-white py-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                <p className="text-gray-600">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identifier */}
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
                        errors.identifier ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter email or mobile number"
                      required
                    />
                  </div>
                  {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {/* smaller toggle icon */}
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>

                {/* Other content remains unchanged */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
