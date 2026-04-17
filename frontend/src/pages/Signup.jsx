import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup as signupService } from "../services/authService";
import { validateSignup } from "../utils/validateForm";
import { Shield, Eye, EyeOff, Loader, CheckCircle } from "lucide-react";


const handleChange = (e) => {
    SVGAnimateTransformElement({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: ""})
    setApiError("")
}

