import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/authService";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    course: "",
    section: "",
    college: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid)
        .then((data) => {
          if (data) {
            setProfile(data);
            setForm({
              name: data.name || "",
              course: data.course || "",
              section: data.section || "",
              college: data.college || "",
              phone: data.phone || "",
            });
          } else {
            setProfile({});
          }
        })
        .catch((e) => {
          console.error("Failed to load profile:", e);
          setProfile({});
        });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile(user.uid, form);
      setProfile(form);
      alert("Profile updated successfully!");
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update profile. Please try again.");
    }
    setIsLoading(false);
  };

  if (!user || profile === null)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <Loader2 className="animate-spin mr-2 h-6 w-6" /> Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 flex justify-center">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        {/* Back button on top */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-rose-600 hover:text-rose-800 transition mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Home
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Profile
        </h1>

        <div className="space-y-4">
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            label="Course"
            name="course"
            value={form.course}
            onChange={handleChange}
          />
          <InputField
            label="Section"
            name="section"
            value={form.section}
            onChange={handleChange}
          />

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College
            </label>
            <select
              name="college"
              value={form.college}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
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

          <InputField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={user.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 px-4 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
      />
    </div>
  );
}
