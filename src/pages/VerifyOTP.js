import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email, correctOtp, isReset } = location.state || {};

  const handleSubmit = () => {
    if (!email || !correctOtp) {
      setError("Something went wrong. Please try again.");
      return;
    }

    if (otp === correctOtp) {
      console.log("OTP verified successfully");
      if (isReset) {
        navigate("/reset-password", { state: { email } });
      } else {
        navigate("/");
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Verify OTP
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit code sent to your email.
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength="6"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300 text-center text-lg tracking-widest"
        />
        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
