import { useState, useEffect } from "react";
import { addItem } from "../services/itemService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, ArrowLeft } from "lucide-react";
import imageCompression from "browser-image-compression";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase-config";

export default function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    college: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.college ||
      !form.category
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (!profile) {
      alert("User profile not loaded. Try again.");
      return;
    }

    setIsLoading(true);
    try {
      let itemData = {
        ...form,
        uid: user.uid,
        createdAt: Date.now(),
        phone: profile.phone || "",
        email: user.email || "",
        name: profile.name || "",
      };

      if (image) {
        // compress aggressively
        const compressedFile = await imageCompression(image, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/webp",
        });

        // read as Data URL
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);

        await new Promise((resolve, reject) => {
          reader.onloadend = () => {
            itemData.imageDataUrl = reader.result;
            resolve();
          };
          reader.onerror = reject;
        });
      }

      await addItem(itemData);
      navigate("/");
    } catch (e) {
      console.error("Add item error:", e);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 flex justify-center">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-xl">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center text-rose-600 hover:text-rose-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Home
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Item</h1>

        <div className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter item title"
          />
          <InputField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description"
          />
          <InputField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Where you found/lost"
          />

          {/* College dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College
            </label>
            <select
              name="college"
              value={form.college}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
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

          {/* Category dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="">Select category</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optional)
            </label>
            <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
              <ImagePlus className="h-5 w-5 text-gray-400 ml-3" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="pl-2 py-2 w-full text-sm"
              />
            </div>
            {/* Progress display */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-gradient-to-r from-rose-500 to-orange-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            {uploadProgress > 0 && (
              <div className="text-xs text-gray-600 mt-1">
                {uploadProgress}%
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Adding...
              </span>
            ) : (
              "Add Item"
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
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
    </div>
  );
}
