import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/authService";
import { validateLogin } from "../utils/validateForm";
import { ShieldCheck, Eye, EyeOff, Loader,Lock, Mail } from "lucide-react";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      const res = await loginService(form);
      login(res.access_token, res.user);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.detail || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-linear-to-br
                      from-[#1E3A5F] via-[#2E86AB] to-[#1E3A5F]
                      flex-col items-center justify-center p-12 relative
                      overflow-hidden"
      >
        {/* Background circles */}
        <div
          className="absolute top-20 left-20 w-72 h-72
                        bg-white opacity-5 rounded-full"
        />
        <div
          className="absolute bottom-15 right-15 w-56 h-56
                        bg-white opacity-5 rounded-full"
        />

        <div className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ShieldCheck className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Insure<span className="text-[#F4A261]">Predict</span>
          </h1>
          <p className="text-blue-200 text-lg mb-12 max-w-sm">
            Smart insurance premium prediction powered by real-world data
          </p>

          {[
            " Instant premium calculation",
            " Personalized risk score",
            " Professional PDF reports",
            " Plan comparison & savings",
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mb-4 bg-white/10
                         backdrop-blur px-5 py-3 rounded-xl text-left"
            >
              <span className="text-sm text-white">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-full lg:w-1/2 flex items-center justify-center
                      px-6 py-12 bg-gray-50"
      >
        <div className="w-full max-w-md">
          {/* Logo — mobile only */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <ShieldCheck className="w-8 h-8 text-[#2E86AB]" />
            <span className="text-2xl font-bold text-[#1E3A5F]">
              Insure<span className="text-[#2E86AB]">Predict</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E3A5F]">
              Welcome back 👋
            </h2>
            <p className="text-gray-500 mt-2">
              Login to access your insurance dashboard
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div
              className="flex items-center gap-3 bg-red-50 border
                            border-red-200 text-red-600 text-sm rounded-xl
                            px-4 py-3 mb-6"
            >
              <span>⚠️</span> {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                              text-sm outline-none transition
                              focus:ring-2 focus:ring-[#2E86AB]
                              focus:border-[#2E86AB] bg-white
                              ${
                                errors.email
                                  ? "border-red-400 bg-red-50"
                                  : "border-gray-200"
                              }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <span
                  className="text-xs text-[#2E86AB] cursor-pointer
                                 hover:underline"
                >
                  Forgot password?
                </span>
              </div>
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
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border
                              text-sm outline-none transition
                              focus:ring-2 focus:ring-[#2E86AB]
                              focus:border-[#2E86AB] bg-white
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E86AB] hover:bg-[#1E3A5F] text-white
                         font-semibold py-3.5 rounded-xl transition-all
                         duration-200 flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-200 hover:shadow-blue-300
                         mt-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Dashboard →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#2E86AB] font-semibold hover:underline"
            >
              Create free account →
            </Link>
          </p>

          {/* Trust badges */}
          <div
            className="flex items-center justify-center gap-6 mt-8
                          pt-6 border-t border-gray-100"
          >
            {[" Secure", " Instant", " Free"].map((b, i) => (
              <span key={i} className="text-xs text-gray-400">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}