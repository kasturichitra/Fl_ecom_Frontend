import { useState } from "react";
import { useForgotPassword } from "../hooks/useAuth";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { mutateAsync: forgotPassword, isPending: isForgotPasswordPending } = useForgotPassword({
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to send OTP");
    },
    onSuccess: () => {
      setSuccess("OTP sent successfully. Please check your messages.");
    },
  });

  // Regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePattern = /^[0-9]{10}$/;

  const handleChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    setSuccess("");

    if (!value) {
      setError("This field is required");
    } else if (!emailPattern.test(value) && !mobilePattern.test(value)) {
      setError("Enter a valid email or 10-digit mobile number");
    } else {
      setError("");
    }
  };

  const handleSendOtp = async () => {
    if (!identifier || error) return;

    const payload = emailPattern.test(identifier) ? { email: identifier } : { phone_number: identifier };

    await forgotPassword(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-600 mb-6">Enter your registered email or mobile number to receive an OTP</p>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
          <input
            type="text"
            value={identifier}
            onChange={handleChange}
            placeholder="Enter email or mobile number"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-1">{success}</p>}
        </div>

        {/* Button */}
        <button
          onClick={handleSendOtp}
          disabled={isForgotPasswordPending || !!error || !identifier}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {isForgotPasswordPending ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
