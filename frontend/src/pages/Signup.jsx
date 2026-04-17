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