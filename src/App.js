// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import CampusKeeperSignup from "./pages/Signup";
import Signin from "./pages/Signin";
import AddItem from "./pages/AddItem";
import ItemDetail from "./pages/ItemDetail";
import Profile from "./pages/Profile";
import CampusKeeperForgotPassword from "./pages/ForgotPassword";
import DeleteItems from "./pages/DeleteItems"; // ✅ NEW

// Protect routes: only allow if user is logged in
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
}

// Layout wrapper without header
function AppLayout() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/signup" element={<CampusKeeperSignup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<CampusKeeperForgotPassword />} />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <AddItem />
          </PrivateRoute>
        }
      />
      <Route
        path="/delete"
        element={
          <PrivateRoute>
            <DeleteItems />
          </PrivateRoute>
        }
      />
      <Route
        path="/item/:id"
        element={
          <PrivateRoute>
            <ItemDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
