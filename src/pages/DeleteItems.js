import { useEffect, useState } from "react";
import { getItems, deleteItem } from "../services/itemService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function DeleteItems() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const all = await getItems();
      const mine = all.filter((item) => item.uid === user.uid);
      setMyItems(mine);
    };
    fetch();
  }, [user]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      alert("Please select at least one item to delete.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete ${selected.length} item(s)?`
      )
    )
      return;

    try {
      await Promise.all(selected.map((id) => deleteItem(id)));
      alert("Deleted!");
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Failed to delete items.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-700 mb-4 hover:text-rose-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Delete My Items
        </h1>

        {myItems.length === 0 && (
          <p className="text-gray-500">You haven't posted any items yet.</p>
        )}

        <div className="space-y-3">
          {myItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="mr-3"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {myItems.length > 0 && (
          <button
            onClick={handleDelete}
            className="mt-6 w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:from-rose-600 hover:to-orange-600 transition-all flex items-center justify-center"
          >
            <Trash2 className="h-5 w-5 mr-2" /> Delete Selected Items
          </button>
        )}
      </div>
    </div>
  );
}
