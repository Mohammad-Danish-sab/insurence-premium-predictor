import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  History,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const isActive = (path) =>
    location.pathname === path
      ? "text-secondary font-semibold border-b-2 border-secondary"
      : "text-gray-600 hover:text-secondary transition";

  return (
    <nav className="bg-slate-500 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="text-secondary w-7 h-7" />
            <span className="text-xl font-bold text-white">
              Insure<span className="text-red-600">Predict</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className={isActive("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/predict" className={isActive("/predict")}>
                  Get Quote
                </Link>
                <Link to="/history" className={isActive("/history")}>
                  History
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className={isActive("/admin")}>
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-red-500 hover:bg-blue-200
                             px-3 py-2 rounded-full transition"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-secondary flex
                                  items-center justify-center text-white font-bold text-sm"
                  >
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user.full_name?.split(" ")[0]}
                  </span>
                </button>

                {dropOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-gray-200 rounded-xl
                                  shadow-lg border border-blue-300 py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm
                                 text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm
                                 text-gray-700 hover:bg-gray-50"
                    >
                      <History className="w-4 h-4" /> History
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm
                                   text-gray-700 hover:bg-gray-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm
                                 text-danger hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white hover:text-secondary transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-secondary text-white text-sm font-medium
                             px-5 py-2 rounded-full hover:bg-primary transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-100 px-4 py-4
                        flex flex-col gap-4"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-900"
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                to="/predict"
                onClick={() => setMenuOpen(false)}
                className="text-gray-900"
              >
                Get Quote
              </Link>
              <Link
                to="/history"
                onClick={() => setMenuOpen(false)}
                className="text-gray-900"
              >
                History
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-left text-danger font-medium"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-secondary text-white px-4 py-2 rounded-full text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}