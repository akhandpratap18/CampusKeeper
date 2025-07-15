import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function CampusKeeperLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      if (
        userEmail.endsWith("@geu.ac.in") ||
        userEmail.endsWith("@gehu.ac.in")
      ) {
        navigate("/");
      } else {
        alert(
          "Please use your college email ending with @geu.ac.in or @gehu.ac.in"
        );
        await auth.signOut();
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full mb-4 shadow-md">
            <span className="text-white font-bold text-xl">CK</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Campus Keeper
          </h1>
          <p className="text-gray-600">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              College Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@geu.ac.in"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-center mt-6">
          <button
            onClick={handleForgotPassword}
            className="text-rose-600 hover:text-rose-700 text-sm font-medium"
          >
            Forgot your password?
          </button>
        </div>

        {/* Sign Up */}
        <div className="text-center mt-4">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <button
            onClick={handleSignupRedirect}
            className="text-rose-600 hover:text-rose-700 text-sm font-medium underline"
          >
            Sign up here
          </button>
        </div>

        {/* Endorsement line */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 italic text-sm">
            Where lost meets found — and more!
          </span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
