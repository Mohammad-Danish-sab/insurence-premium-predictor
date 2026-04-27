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
  const { user, login } = useAuth();

  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [avatar, setAvatar] = useState(null); // preview URL
  const [avatarFile, setAvatarFile] = useState(null); // actual file
  const fileRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    username: user?.username || "",
  });

  const [passForm, setPassForm] = useState({
    old_password: "",
    new_password: "",
    confirm: "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handlePassChange = (e) => {
    setPassForm({ ...passForm, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await updateProfile(profileForm);
      login(localStorage.getItem("token"), {
        ...user,
        ...res.user,
      });
      setSuccess("Profile updated successfully! ✅");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.confirm)
      return setError("Passwords do not match");
    if (passForm.new_password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await changePassword({
        old_password: passForm.old_password,
        new_password: passForm.new_password,
      });
      setSuccess("Password changed successfully! ✅");
      setPassForm({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

    const getStrength = (pass) => {
      if (!pass) return { score: 0, label: "", color: "" };
      let score = 0;
      if (pass.length >= 6) score++;
      if (pass.length >= 10) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;
      const levels = [
        { label: "", color: "" },
        { label: "Weak", color: "bg-red-400" },
        { label: "Fair", color: "bg-yellow-400" },
        { label: "Good", color: "bg-blue-400" },
        { label: "Strong", color: "bg-green-400" },
        { label: "Very Strong", color: "bg-green-500" },
      ];
      return { score, ...levels[score] };
    };

    const strength = getStrength(passForm.new_password);

    const tabs = [
      { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
      { id: "password", label: "Security", icon: <Key className="w-4 h-4" /> },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="w-4 h-4" />,
      },
    ];
}