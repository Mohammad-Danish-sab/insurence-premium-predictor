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


            </div>
          </div>
        </nav>
      );
  }