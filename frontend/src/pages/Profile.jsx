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

      const currentAvatar = avatar || user?.avatar_url || null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div
          className="bg-linear-to-r from-[#1E3A5F] to-[#2E86AB]
                        rounded-3xl p-8 mb-8 text-white relative
                        overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-white
                          opacity-5 rounded-full -translate-y-32
                          translate-x-32"
          />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 bg-white
                          opacity-5 rounded-full translate-y-20
                          -translate-x-20"
          />

          <div
            className="relative z-10 flex flex-col sm:flex-row
                          items-center sm:items-start gap-6"
          >
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 rounded-2xl border-4
                              border-white/30 overflow-hidden
                              bg-white/20 backdrop-blur"
              >
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center
                                  justify-center text-4xl font-bold
                                  text-white"
                  >
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8
                           bg-[#F4A261] hover:bg-orange-500 rounded-full
                           flex items-center justify-center shadow-lg
                           transition"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div
                className="flex items-center gap-2 justify-center
                              sm:justify-start mb-1"
              >
                <h1 className="text-2xl font-bold">{user?.full_name}</h1>
                <BadgeCheck className="w-5 h-5 text-[#F4A261]" />
              </div>
              <p className="text-blue-200 text-sm mb-1">{user?.email}</p>
              {user?.username && (
                <p className="text-blue-300 text-sm mb-2">@{user.username}</p>
              )}
              <div
                className="flex items-center gap-2 justify-center
                              sm:justify-start"
              >
                <span
                  className="px-3 py-1 bg-white/20 backdrop-blur
                                 rounded-full text-xs font-medium capitalize"
                >
                  {user?.role} Account
                </span>
                <span
                  className="px-3 py-1 bg-green-500/30 rounded-full
                                 text-xs font-medium text-green-200"
                >
                  ✅ Active
                </span>
              </div>

              {avatarFile && (
                <p className="text-xs text-[#F4A261] mt-2">
                  📸 New photo selected — save profile to apply
                </p>
              )}
            </div>

            <div className="hidden lg:flex flex-col gap-2 shrink-0">
              {[
                { label: "Member Since", value: "2025" },
                { label: "Account Type", value: user?.role || "User" },
                { label: "Status", value: "Active ✅" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur
                                        rounded-xl px-4 py-2 text-right"
                >
                  <p className="text-xs text-blue-200">{s.label}</p>
                  <p className="text-sm font-semibold capitalize">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl
                        border border-gray-100 shadow-sm w-fit"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setSuccess("");
                setError("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl
                          text-sm font-medium transition
                ${
                  tab === t.id
                    ? "bg-[#2E86AB] text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {success && (
          <div
            className="flex items-center gap-3 bg-green-50 border
                          border-green-200 rounded-2xl px-5 py-3 mb-5"
          >
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        )}
        {error && (
          <div
            className="flex items-center gap-3 bg-red-50 border
                          border-red-200 rounded-2xl px-5 py-3 mb-5"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {tab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 bg-slate-300 rounded-3xl border
                            border-gray-100 shadow-sm p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Edit3 className="w-5 h-5 text-[#2E86AB]" />
                <h2 className="font-bold text-[#1E3A5F]">Edit Profile</h2>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="flex flex-col gap-5"
              >
                <div
                  className="flex items-center gap-4 p-4 bg-gray-50
                                rounded-2xl border border-gray-100"
                >
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden
                                  bg-[#2E86AB]/10 shrink-0"
                  >
                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center
                                      justify-center text-2xl font-bold
                                      text-[#2E86AB]"
                      >
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Profile Picture
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 bg-[#2E86AB]/10
                                 hover:bg-[#2E86AB]/20 text-[#2E86AB]
                                 text-xs font-semibold px-3 py-1.5
                                 rounded-lg transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {avatarFile ? "Change Photo" : "Upload Photo"}
                    </button>
                  </div>
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(null);
                        setAvatarFile(null);
                      }}
                      className="text-xs text-red-400 hover:text-red-600
                                 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Username
                    <span className="text-gray-400 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-3 text-gray-400
                                     text-sm font-medium"
                    >
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Your unique username on InsurePredict
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-3.5 w-4 h-4
                                     text-gray-400"
                    />
                    <input
                      type="text"
                      name="full_name"
                      value={profileForm.full_name}
                      onChange={handleProfileChange}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                  </div>
                </div>

                {/* Email (readonly) */}
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Email Address
                    <span className="text-gray-400 font-normal ml-1">
                      (cannot change)
                    </span>
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-3.5 w-4 h-4
                                     text-gray-400"
                    />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border
                                 border-gray-100 text-sm bg-gray-50
                                 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3.5 top-3.5 w-4 h-4
                                      text-gray-400"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="+91"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#2E86AB]
                             to-[#1E3A5F] text-white font-semibold
                             py-3.5 rounded-xl transition flex items-center
                             justify-center gap-2 disabled:opacity-60
                             shadow-lg hover:opacity-90"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="bg-slate-300 rounded-3xl border border-gray-200
                              shadow-sm p-6"
              >
                <h3 className="font-bold text-[#1E3A5F] mb-4">
                  Account Summary
                </h3>
                {[
                  {
                    icon: <User className="w-4 h-4 text-red-500" />,
                    label: "Name",
                    value: user?.full_name,
                  },
                  {
                    icon: <Mail className="w-4 h-4 text-blue-500" />,
                    label: "Email",
                    value: user?.email,
                  },
                  {
                    icon: <Phone className="w-4 h-4 text-red-500" />,
                    label: "Phone",
                    value: user?.phone || "Not set",
                  },
                  {
                    icon: <Shield className="w-4 h-4 text-green-500" />,
                    label: "Role",
                    value:
                      user?.role?.charAt(0).toUpperCase() +
                      user?.role?.slice(1),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3
                               border-b border-gray-50 last:border-0"
                  >
                    {item.icon}
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-gray-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="bg-blue-50 rounded-2xl border border-blue-100
                              p-4"
              >
                <p className="text-sm font-semibold text-[#1E3A5F] mb-2">
                  📸 Photo Tips
                </p>
                <ul className="text-xs text-gray-500 flex flex-col gap-1">
                  <li> ➡️ Use a clear, front-facing photo</li>
                  <li> ➡️ Good lighting recommended</li>
                  <li> ➡️ Max size: 2MB</li>
                  <li> ➡️ Formats: JPG, PNG, GIF</li>
                </ul>
              </div>

              <div
                className="bg-linear-to-r from-[#1E3A5F]
                              to-[#2E86AB] rounded-2xl p-4 text-white"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#F4A261]" />
                  <p className="text-sm font-semibold">
                    Your Priority is Our Priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "password" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 bg-slate-300 rounded-3xl border
                            border-gray-100 shadow-sm p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-5 h-5 text-[#2E86AB]" />
                <h2 className="font-bold text-[#1E3A5F]">Change Password</h2>
              </div>

              <form onSubmit={handlePassSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-3.5 w-4 h-4
                                     text-gray-400"
                    />
                    <input
                      type={showOld ? "text" : "password"}
                      name="old_password"
                      value={passForm.old_password}
                      onChange={handlePassChange}
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-3.5 top-3.5 text-gray-400
                                 hover:text-gray-600"
                    >
                      {showOld ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-3.5 w-4 h-4
                                     text-gray-400"
                    />
                    <input
                      type={showNew ? "text" : "password"}
                      name="new_password"
                      value={passForm.new_password}
                      onChange={handlePassChange}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3.5 text-gray-400
                                 hover:text-gray-600"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {passForm.new_password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all
                              ${
                                i <= strength.score
                                  ? strength.color
                                  : "bg-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs mt-1 font-medium
                        ${
                          strength.score <= 1
                            ? "text-red-500"
                            : strength.score <= 2
                              ? "text-yellow-500"
                              : strength.score <= 3
                                ? "text-blue-500"
                                : "text-green-500"
                        }`}
                      >
                        {strength.label} password
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-3.5 w-4 h-4
                                     text-gray-400"
                    />
                    <input
                      type={showCon ? "text" : "password"}
                      name="confirm"
                      value={passForm.confirm}
                      onChange={handlePassChange}
                      placeholder="Repeat new password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border
                                  text-sm outline-none focus:ring-2
                                  focus:ring-[#2E86AB] bg-white
                                  ${
                                    passForm.confirm &&
                                    passForm.confirm !== passForm.new_password
                                      ? "border-red-400 bg-red-50"
                                      : "border-gray-200"
                                  }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCon(!showCon)}
                      className="absolute right-3.5 top-3.5 text-gray-400
                                 hover:text-gray-600"
                    >
                      {showCon ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passForm.confirm &&
                    passForm.confirm !== passForm.new_password && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠ Passwords do not match
                      </p>
                    )}
                  {passForm.confirm &&
                    passForm.confirm === passForm.new_password &&
                    passForm.confirm.length > 0 && (
                      <p className="text-green-500 text-xs mt-1">
                        ✅ Passwords match
                      </p>
                    )}
                </div>

                <div
                  className="bg-amber-50 border border-amber-200
                                rounded-xl p-3"
                >
                  <p className="text-xs text-amber-700">
                    💡 Use at least 6 characters with uppercase letters, numbers
                    and special characters for a strong password.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#2E86AB]
                             to-[#1E3A5F] text-white font-semibold
                             py-3.5 rounded-xl transition flex items-center
                             justify-center gap-2 disabled:opacity-60
                             shadow-lg hover:opacity-90"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" /> Update Password
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="bg-slate-300 rounded-3xl border border-gray-100
                              shadow-sm p-6"
              >
                <h3 className="font-bold text-[#1E3A5F] mb-4">
                  🔒 Security Tips
                </h3>
                {[
                  "Use at least 8 characters",
                  "Mix uppercase and lowercase",
                  "Add numbers and symbols",
                  "Never reuse old passwords",
                  "Don't share your password",
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-2
                               border-b border-gray-50 last:border-0"
                  >
                    <CheckCircle
                      className="w-3.5 h-3.5 text-green-500
                                            shrink-0"
                    />
                    <p className="text-xs text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>

              <div
                className="bg-linear-to-r from-[#1E3A5F]
                              to-[#2E86AB] rounded-2xl p-4 text-white"
              >
                <Shield className="w-6 h-6 text-[#F4A261] mb-2" />
                <p className="text-sm font-semibold mb-1">
                  Your account is secure
                </p>
                <p className="text-xs text-blue-200">
                  Your Priority is our Priority
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}