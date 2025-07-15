import { useEffect, useState } from "react";
import { getItems } from "../services/itemService";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { PlusCircle, User, LogOut, Search, Trash2 } from "lucide-react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout, try again.");
    }
  };

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 pt-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CK</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Campus Keeper</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/add")}
              className="flex items-center bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Item
            </button>
            <button
              onClick={() => navigate("/delete")}
              className="flex items-center bg-white text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-all shadow-md border border-gray-200"
            >
              <Trash2 className="h-5 w-5 mr-2" /> Delete
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center bg-white text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-all shadow-md border border-gray-200"
            >
              <User className="h-5 w-5 mr-2" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-all"
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for lost or found items..."
            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all shadow-lg"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <Link to={`/item/${item.id}`} key={item.id} className="group">
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 hover:border-rose-300 transition-all duration-300 hover:shadow-2xl group-hover:transform group-hover:scale-105">
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h2>
                  {item.category && (
                    <span
                      className={`text-sm font-bold px-4 py-2 rounded-full ${
                        item.category === "Lost"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 flex items-center">
                    <span className="text-lg mr-2">📍</span>
                    <span className="font-medium">{item.location}</span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="text-lg mr-2">🎓</span>
                    <span className="font-medium">{item.college}</span>
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-xl">No items found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
