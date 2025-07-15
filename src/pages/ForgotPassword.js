import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import emailjs from "emailjs-com";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase-config";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export default function CampusKeeperForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOtp, setCurrentOtp] = useState("");
  const [otp, setOtp] = useState("");

  const isCollegeEmail = (email) =>
    email.endsWith("@geu.ac.in") || email.endsWith("@gehu.ac.in");

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (!isCollegeEmail(email)) {
      alert("Please use your college email (@geu.ac.in or @gehu.ac.in)");
      return;
    }

    setIsLoading(true);
    try {
      const db = getFirestore(app);
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("User not registered. Redirecting to signup...");
        window.location.href = "/signup";
        return;
      }

      const generatedOtp = generateOtp();
      setCurrentOtp(generatedOtp);

      await emailjs.send(
        "service_ur8dz2a",
        "template_a7l3r6g",
        { to_email: email, otp: generatedOtp, name: "User" },
        "rmlRKvoqRXdC43m-k"
      );

      alert("OTP sent! Check your email.");
      setStep(2);
    } catch (error) {
      console.error("Error checking user or sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp !== currentOtp) {
      alert("Incorrect OTP. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      alert(
        "Password reset email sent! Please check your inbox to set a new password."
      );
      window.location.href = "/signin";
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      alert("Failed to send password reset email. Please try again.");
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full mb-4">
            <span className="text-white font-bold text-xl">CK</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">
            {step === 1 && "Enter your college email to receive OTP."}
            {step === 2 && "Enter the OTP sent to your email."}
          </p>
        </div>

        {step === 1 && (
          <>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="your.email@geu.ac.in"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300 text-center text-lg font-semibold tracking-widest"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {isLoading
                ? "Sending Reset Email..."
                : "Verify & Send Reset Email"}
            </button>
            <button
              onClick={handleBack}
              className="w-full flex items-center justify-center px-4 py-3 text-rose-600 hover:text-rose-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
