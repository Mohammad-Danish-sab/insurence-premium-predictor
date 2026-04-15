import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/authService";
import { validateLogin } from "../utils/validateForm";
import { Shield, Eye, EyeOff, Loader } from "lucide-react";


export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [form,     setForm]     = useState({ email: "", password: "" })
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
    setApiError("")
  }

}