import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { predictPremium, predictGuest } from "../services/predictService";
import { validatePredictForm } from "../utils/validateForm";
import { formatINR } from "../utils/formatCurrency";
import {
  Loader,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";


const riskColor = (level) => ({
  "Low":       "text-green-600 bg-green-50  border-green-200",
  "Medium":    "text-yellow-600 bg-yellow-50 border-yellow-200",
  "High":      "text-orange-600 bg-orange-50 border-orange-200",
  "Very High": "text-red-600 bg-red-50 border-red-200",
}[level] || "text-gray-600 bg-gray-50 border-gray-200")

export default function Predict() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    age: "", sex: "male", bmi: "", children: "0",
    smoker: false, region: "northeast", insurance_type: "health"
  })
  const [errors,  setErrors]  = useState({})
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiErr,  setApiErr]  = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validatePredictForm(form)
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    setApiErr("")
    setResult(null)

    try {
      const payload = {
        ...form,
        age:      parseInt(form.age),
        bmi:      parseFloat(form.bmi),
        children: parseInt(form.children),
      }
      const res = user
        ? await predictPremium(payload)
        : await predictGuest(payload)
      setResult(res)

      setTimeout(() =>
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 100
      )
    } catch (err) {
      setApiErr(err.response?.data?.detail || "Prediction failed. Try again.")
    } finally {
      setLoading(false)
    }
  }
}