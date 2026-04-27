import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/authService";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
  Key,
  AlertTriangle,
  Camera,
  Edit3,
  BadgeCheck,
  Settings,
} from "lucide-react";

export default function Profile() {
  const { user, login } = useAuth()

  const [tab,        setTab]        = useState("profile")
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState("")
  const [error,      setError]      = useState("")
  const [showOld,    setShowOld]    = useState(false)
  const [showNew,    setShowNew]    = useState(false)
  const [showCon,    setShowCon]    = useState(false)
  const [avatar,     setAvatar]     = useState(null)    // preview URL
  const [avatarFile, setAvatarFile] = useState(null)    // actual file
  const fileRef                     = useRef(null)

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    phone:     user?.phone     || "",
    username:  user?.username  || "",
  })

  const [passForm, setPassForm] = useState({
    old_password: "",
    new_password: "",
    confirm:      ""
  })

}