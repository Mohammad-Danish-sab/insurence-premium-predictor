import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup as signupService } from "../services/authService";
import { validateSignup } from "../utils/validateForm";
import { ShieldCheck, Eye, EyeOff, Loader, CheckCircle, User, Mail, Phone, Lock, } from "lucide-react";


export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSignup(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await signupService(form);
      login(res.access_token, res.user);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.detail || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Free premium predictions",
    "PDF report download",
    "Risk score analysis",
    "Plan comparison",
  ];

  const steps = ["Create account", "Fill details", "Get quote"];

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-linear-to-br
                      from-[#1E3A5F] via-[#2E86AB] to-[#1E3A5F]
                      flex-col items-center justify-center p-12
                      relative overflow-hidden"
      >
        <div
          className="absolute top-20 left-20 w-72 h-72
                        bg-white opacity-5 rounded-full"
        />
        <div
          className="absolute bottom-15 right-15 w-56 h-56
                        bg-white opacity-5 rounded-full"
        />

        <div className="relative z-10 text-white text-center">
          <ShieldCheck className="w-14 h-14 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-3">
            Insure<span className="text-[#F4A261]">Predict</span>
          </h1>
          <p className="text-blue-200 mb-10 max-w-sm">
            Join thousands of users making smarter insurance decisions
          </p>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {perks.map((p, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur rounded-xl
                           px-4 py-3 text-left flex items-center gap-2"
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-sm text-white">{p.text}</span>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
            <p className="text-sm text-blue-200 mb-4 font-medium">
              Get started in 3 steps
            </p>
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <div
                  className="w-7 h-7 rounded-full bg-[#F4A261] flex
                                items-center justify-center text-white
                                text-xs font-bold shrink-0"
                >
                  {i + 1}
                </div>
                <span className="text-sm text-white">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="w-full lg:w-1/2 flex items-center justify-center
                      px-6 py-12 bg-gray-50 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div
            className="flex items-center justify-center gap-2
                          mb-8 lg:hidden"
          >
            <ShieldCheck className="w-8 h-8 text-[#2E86AB]" />
            <span className="text-2xl font-bold text-[#1E3A5F]">
              Insure<span className="text-[#2E86AB]">Predict</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E3A5F]">
              Create account 🚀
            </h2>
            <p className="text-gray-500 mt-2">
              Free forever. No credit card needed.
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div
              className="flex items-center gap-2 bg-red-50 border
                            border-red-200 text-red-600 text-sm
                            rounded-xl px-4 py-3 mb-6"
            >
              ⚠️ {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  className="absolute left-3.5 top-3 w-4 h-4
                                 text-gray-400"
                />
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border
                              text-sm outline-none transition bg-white
                              focus:ring-2 focus:ring-[#2E86AB]
                              focus:border-[#2E86AB]
                              ${
                                errors.full_name
                                  ? "border-red-400 bg-red-50"
                                  : "border-gray-200"
                              }`}
                />
              </div>
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1.5">
                  ⚠ {errors.full_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold
                                text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-3 w-4 h-4
                                 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border
                              text-sm outline-none transition bg-white
                              focus:ring-2 focus:ring-[#2E86AB]
                              focus:border-[#2E86AB]
                              ${
                                errors.email
                                  ? "border-red-400 bg-red-50"
                                  : "border-gray-200"
                              }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">⚠ {errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-semibold
                                text-gray-700 mb-1.5"
              >
                Phone{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-3 w-4 h-4
                                  text-gray-400"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border
                              text-sm outline-none transition bg-white
                              focus:ring-2 focus:ring-[#2E86AB]
                              focus:border-[#2E86AB]
                              ${
                                errors.phone
                                  ? "border-red-400 bg-red-50"
                                  : "border-gray-200"
                              }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1.5">⚠ {errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-semibold
                                text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-3 w-4 h-4
                                 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border
                              text-sm outline-none transition bg-white
                              focus:ring-2 focus:ring-[#2E86AB]
                              focus:border-[#2E86AB]
                              ${
                                errors.password
                                  ? "border-red-400 bg-red-50"
                                  : "border-gray-200"
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-gray-400
                             hover:text-gray-600 transition"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  ⚠ {errors.password}
                </p>
              )}
              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all
                        ${
                          form.password.length >= i * 2
                            ? i <= 1
                              ? "bg-red-400"
                              : i <= 2
                                ? "bg-yellow-400"
                                : i <= 3
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E86AB] hover:bg-[#1E3A5F] text-white
                         font-semibold py-3.5 rounded-xl transition-all
                         duration-200 flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-200 mt-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Free Account →"
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center">
              By signing up, you agree to our{" "}
              <span className="text-[#2E86AB] cursor-pointer hover:underline">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-[#2E86AB] cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#2E86AB] font-semibold hover:underline"
            >
              Login →
            </Link>
          </p>

          {/* Trust badges */}
          <div
            className="flex items-center justify-center gap-4
                          mt-6 pt-6 border-t border-gray-100"
          >
            {[" Secure & Private", " Instant Access", " Always Free"].map(
              (b, i) => (
                <span key={i} className="text-xs text-gray-400">
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}