import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup as signupService } from "../services/authService";
import { validateSignup } from "../utils/validateForm";
import { Shield, Eye, EyeOff, Loader, CheckCircle } from "lucide-react";

const handleChange = (e) => {
  SVGAnimateTransformElement({ ...form, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: "" });
  setApiError("");
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validateSignup(form);
  if (Object.keys(errs).length) return setErrors(errs);

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

 return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
     <div className="w-full max-w-md">
       <div className="text-center mb-8">
         <Link to="/" className="inline-flex items-center gap-2">
           <Shield className="w-8 h-8 text-secondary" />
           <span className="text-2xl font-bold text-primary">
             Insure<span className="text-secondary">Predict</span>
           </span>
         </Link>
         <h1 className="text-2xl font-bold text-gray-800 mt-6">
           Create your account
         </h1>
         <p className="text-gray-500 text-sm mt-1">
           Free forever. No credit card needed.
         </p>
       </div>

       <div className="grid grid-cols-2 gap-2 mb-6">
         {perks.map((p, i) => (
           <div
             key={i}
             className="flex items-center gap-2 text-xs text-gray-600"
           >
             <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
             {p}
           </div>
         ))}
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
         {apiError && (
           <div
             className="bg-red-50 border border-red-200 text-red-600
                            text-sm rounded-xl px-4 py-3 mb-6"
           >
             {apiError}
           </div>
         )}

         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Full Name
             </label>
             <input
               type="text"
               name="full_name"
               value={form.full_name}
               onChange={handleChange}
               placeholder="Rahul Sharma"
               className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                            focus:ring-2 focus:ring-secondary transition
                            ${errors.full_name ? "border-red-400" : "border-gray-200"}`}
             />
             {errors.full_name && (
               <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
             )}
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Email Address
             </label>
             <input
               type="email"
               name="email"
               value={form.email}
               onChange={handleChange}
               placeholder="rahul@example.com"
               className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                            focus:ring-2 focus:ring-secondary transition
                            ${errors.email ? "border-red-400" : "border-gray-200"}`}
             />
             {errors.email && (
               <p className="text-red-500 text-xs mt-1">{errors.email}</p>
             )}
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Phone <span className="text-gray-400">(optional)</span>
             </label>
             <input
               type="text"
               name="phone"
               value={form.phone}
               onChange={handleChange}
               placeholder="+91 98765 43210"
               className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                            focus:ring-2 focus:ring-secondary transition
                            ${errors.phone ? "border-red-400" : "border-gray-200"}`}
             />
             {errors.phone && (
               <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
             )}
           </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                              focus:ring-2 focus:ring-secondary transition pr-10
                              ${errors.password ? "border-red-400" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
         </form>
       </div>
     </div>
   </div>
 );