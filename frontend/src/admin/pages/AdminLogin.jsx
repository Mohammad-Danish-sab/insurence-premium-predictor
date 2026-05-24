import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ShieldCheck, Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";

import API from "../services/adminService";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    setLoading(true);

    const response = await API.post("/api/auth/login", formData);

    console.log(response.data);

    // SAVE TOKEN
    localStorage.setItem("token", response.data.access_token);

    // SAVE USER
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // SAVE ROLE
    localStorage.setItem("role", response.data.user.role);

    // CHECK ADMIN
    if (response.data.user.role !== "admin") {
      setError("Access denied. Admin only.");
      return;
    }

    navigate("/admin/dashboard");
  } catch (error) {
    console.log(error);

    setError(error.response?.data?.detail || "Admin login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}

      <div
        className="hidden lg:flex lg:w-1/2
                   bg-gradient-to-br
                   from-[#1E3A5F]
                   via-[#2E86AB]
                   to-[#1E3A5F]
                   flex-col items-center justify-center
                   p-12 relative overflow-hidden"
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-5 rounded-full" />

        <div className="absolute bottom-20 right-20 w-56 h-56 bg-white opacity-5 rounded-full" />

        <div className="relative z-10 text-white text-center">
          <ShieldCheck className="w-16 h-16 mx-auto mb-6" />

          <h1 className="text-5xl font-bold mb-4">Admin Panel</h1>

          <p className="text-blue-100 text-lg max-w-sm">
            Manage users, predictions, blogs, analytics and platform monitoring
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div
        className="w-full lg:w-1/2
                   flex items-center justify-center
                   bg-gray-50 px-6"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}

          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <ShieldCheck className="w-8 h-8 text-[#2E86AB]" />

            <h1 className="text-2xl font-bold text-[#1E3A5F]">Admin Panel</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-[#1E3A5F]">
              Welcome Admin 👋
            </h2>

            <p className="text-gray-500 mt-2">Login to access dashboard</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-600 p-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2E86AB]"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2E86AB]"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E86AB]
                         hover:bg-[#1E3A5F]
                         text-white py-3.5 rounded-xl
                         font-semibold transition
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Admin Panel"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have admin account?
            <Link
              to="/admin/signup"
              className="text-[#2E86AB] font-semibold ml-2 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
