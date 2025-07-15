import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  User,
  Phone,
  GraduationCap,
  Users,
  Building2,
} from "lucide-react";
import emailjs from "emailjs-com";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // ✅ add navigate
import { app } from "../firebase-config";

// Initialize EmailJS
emailjs.init("rmlRKvoqRXdC43m-k");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export default function CampusKeeperSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    section: "",
    college: "",
    phone: "",
  });
  const [otp, setOtp] = useState("");
  const [currentOtp, setCurrentOtp] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isCollegeEmail = (email) =>
    email.endsWith("@geu.ac.in") || email.endsWith("@gehu.ac.in");

  const handleSendOTP = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.course ||
      !form.section ||
      !form.college ||
      !form.phone
    ) {
      alert("Please fill all fields");
      return;
    }
    if (!isCollegeEmail(form.email)) {
      alert("Please use your college email (@geu.ac.in or @gehu.ac.in)");
      return;
    }

    setIsLoading(true);
    const newOtp = generateOtp();
    setCurrentOtp(newOtp);

    try {
      await emailjs.send("service_ur8dz2a", "template_a7l3r6g", {
        to_email: form.email,
        otp: newOtp,
        name: form.name,
      });
      alert("OTP sent! Check your email.");
      setStep(2);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send OTP email: " + JSON.stringify(error));
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (otp !== currentOtp) {
      alert("Incorrect OTP. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: form.name,
        email: form.email,
        course: form.course,
        section: form.section,
        college: form.college,
        phone: form.phone,
        createdAt: new Date(),
      });
      alert("Signup successful! Welcome to Campus Keeper.");
      window.location.href = "/";
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        {/* ✅ Back button on top */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-rose-600 hover:text-rose-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full mb-4 shadow-md">
            <span className="text-white font-bold text-xl">CK</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Campus Keeper
          </h1>
          <p className="text-gray-600">
            {step === 1
              ? "Create your account to get started."
              : "Enter the 6-digit OTP sent to your email."}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <InputField
              icon={<User />}
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            <InputField
              icon={<Mail />}
              label="College Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@geu.ac.in"
              type="email"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 pr-10"
                  placeholder="Create a strong password"
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
            <InputField
              icon={<GraduationCap />}
              label="Course"
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="e.g. B.Tech CSE"
            />
            <InputField
              icon={<Users />}
              label="Section"
              name="section"
              value={form.section}
              onChange={handleChange}
              placeholder="e.g. A1"
            />

            {/* ✅ College dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Building2 />
                </span>
                <select
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Select your college</option>
                  <option value="GEU">
                    Graphic Era Deemed to be University (GEU)
                  </option>
                  <option value="GEHU Dehradun">
                    Graphic Era Hill University, Dehradun
                  </option>
                  <option value="GEHU Bhimtal">
                    Graphic Era Hill University, Bhimtal
                  </option>
                  <option value="GEHU Haldwani">
                    Graphic Era Hill University, Haldwani
                  </option>
                </select>
              </div>
            </div>

            <InputField
              icon={<Phone />}
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300 text-center text-lg font-semibold tracking-widest"
            />
            <button
              onClick={handleSignup}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Create Account"}
            </button>
            <button
              onClick={handleBackToForm}
              className="w-full flex items-center justify-center px-4 py-3 text-rose-600 hover:text-rose-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to form
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
              </span>
              <button
                onClick={handleSendOTP}
                className="text-rose-600 hover:text-rose-700 text-sm font-medium underline"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InputField({ icon, label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          {...props}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
    </div>
  );
}
