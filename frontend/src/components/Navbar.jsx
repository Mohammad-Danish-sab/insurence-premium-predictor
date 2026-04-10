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
  const { user, logout }    = useAuth()
  const navigate            = useNavigate()
  const location            = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }
   const isActive = (path) =>
     location.pathname === path
       ? "text-secondary font-semibold border-b-2 border-secondary"
       : "text-gray-600 hover:text-secondary transition";

      return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              <Link to="/" className="flex items-center gap-2">
                <Shield className="text-secondary w-7 h-7" />
                <span className="text-xl font-bold text-primary">
                  Insure<span className="text-secondary">Predict</span>
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
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200
                             px-3 py-2 rounded-full transition"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex
                                  items-center justify-center text-white font-bold text-sm">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.full_name?.split(" ")[0]}
                  </span>
                </button>

            </div>
            ):
            </div>
          </div>
        </nav>
      );
  }