import React, { useEffect, useRef, useState } from "react";
import { useVerifyForgotOtp } from "../hooks/useAuth";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 120; // 2 minutes

const ForgotOtp = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const inputsRef = useRef([]);

  const { mutateAsync: verifyForgotOtp, isPending: isVerifyForgotOtpPending } = useVerifyForgotOtp();

  /* ⏱️ Countdown Timer */
  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  /* ⌨️ Handle OTP Input */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  /* ⌫ Handle Backspace */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* ✅ Verify OTP */
  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    // 🔐 API call will go here

    const otpId = sessionStorage.getItem("otp_id");
    // const reason = sessionStorage.getItem("reason");

    // const formData = new FormData();
    // formData.append("otp_id", otpId);
    // // formData.append("reason", reason);
    // formData.append("otp", enteredOtp);
    // // formData
    // // "device_name": "Mobile"
    // formData.append("device_name", "Mobile");

    const payload = {
      otp_id: otpId,
      otp: enteredOtp,
      device_name: "Mobile",
    };

    await verifyForgotOtp(payload);
  };

  /* ⏳ Format Timer */
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full bg-white rounded-2xl shadow-xl text-center max-w-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Verify OTP</h1>
        <p className="text-gray-600 mb-6">Enter the 4-digit code sent to your phone/email</p>

        {/* 🔢 OTP Inputs */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* ⏱️ Timer */}
        <p className="text-sm text-gray-500 mb-4">
          OTP expires in <span className="font-semibold text-gray-800">{formatTime()}</span>
        </p>

        {/* 🔁 Resend OTP (Static) */}
        <button disabled className="text-sm text-gray-400 cursor-not-allowed mb-6">
          Resend OTP
        </button>

        {/* ✅ Verify Button */}
        <button
          onClick={handleVerify}
          disabled={otp.includes("") || isVerifyForgotOtpPending}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifyForgotOtpPending ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default ForgotOtp;
