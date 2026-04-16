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

 return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Shield className="w-8 h-8 text-secondary" />
            <span className="text-2xl font-bold text-primary">
              Insure<span className="text-secondary">Predict</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-6">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account</p>
        </div>
      </div>
    </div>
 )
}