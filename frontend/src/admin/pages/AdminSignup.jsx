import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Loader,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle,
} from "lucide-react";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/admin/login");
    }, 1500);
  };

  const perks = [
    "Manage users",
    "Monitor predictions",
    "Analytics dashboard",
    "Control reports",
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br
        from-[#1E3A5F] via-[#2E86AB] to-[#1E3A5F]
        relative overflow-hidden items-center justify-center p-12"
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full" />

        <div className="relative z-10 text-white max-w-md">
          <ShieldCheck className="w-14 h-14 mb-6 text-[#F4A261]" />

          <h1 className="text-5xl font-bold leading-tight">
            Admin <span className="text-[#F4A261]">Panel</span>
          </h1>

          <p className="text-blue-100 mt-5 leading-relaxed">
            Securely manage users, analytics, reports and all insurance
            activities from one dashboard.
          </p>

          <div className="mt-10 space-y-4">
            {perks.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 backdrop-blur p-4 rounded-2xl"
              >
                <CheckCircle className="w-5 h-5 text-[#F4A261]" />

                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br
                from-[#2E86AB] to-[#1E3A5F]
                flex items-center justify-center"
              >
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-[#1E3A5F]">Admin Signup</h2>

            <p className="text-gray-500 mt-2">
              Create your administrator account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <div className="relative mt-2">
                <User className="absolute left-4 top-4 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Admin Name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-[#2E86AB] outline-none"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-4 w-4 h-4 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-[#2E86AB] outline-none"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>

              <div className="relative mt-2">
                <Phone className="absolute left-4 top-4 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-[#2E86AB] outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-4 w-4 h-4 text-gray-400" />

                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-[#2E86AB] outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-4"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E86AB] hover:bg-[#1E3A5F]
              text-white py-3.5 rounded-xl font-semibold
              transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="text-[#2E86AB] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
