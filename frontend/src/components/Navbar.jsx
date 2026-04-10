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

}