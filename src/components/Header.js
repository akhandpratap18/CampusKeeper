import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="flex justify-between p-4 bg-gray-100 shadow">
      <Link to="/">Campus Keeper</Link>
      <div>
        <Link to="/add" className="mr-2">
          Add Item
        </Link>
        <Link to="/profile" className="mr-2">
          Profile
        </Link>
        {user && <button onClick={logout}>Logout</button>}
      </div>
    </header>
  );
}
