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
 const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateLogin(form)
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await loginService(form)
      login(res.access_token, res.user)
      navigate("/dashboard")
    } catch (err) {
      setApiError(err.response?.data?.detail || "Login failed. Try again.")
    } finally {
      setLoading(false)
    }
}

}