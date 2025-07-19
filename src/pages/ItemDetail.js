import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const docSnap = await getDoc(doc(db, "items", id));
      if (docSnap.exists()) setItem(docSnap.data());
    };
    fetch();
  }, [id]);

  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 flex justify-center">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-rose-600 hover:text-rose-800 transition mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Home
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h1>
        <p className="text-gray-600 mb-2">
          🎓 {item.college} • 📍 {item.location}
        </p>
        <p className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              item.category === "Lost"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {item.category}
          </span>
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

        
        <div className="mb-4">
          {item.imageUrl || item.imageDataUrl ? (
            <img
              src={item.imageUrl || item.imageDataUrl}
              alt={item.title}
              className="w-full rounded-xl border border-gray-200"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-xl text-gray-400">
              No image available
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Posted on: {new Date(item.createdAt).toLocaleString()}
        </p>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Contact Details
          </h2>
          <p className="text-gray-700 mb-1">
            👤 Name: {item.name || "Not provided"}
          </p>
          <p className="text-gray-700 mb-1">
            📞 Phone: {item.phone || "Not provided"}
          </p>
          <p className="text-gray-700">
            ✉️ Email: {item.email || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}
