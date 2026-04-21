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
    const Field = ({
      label,
      name,
      type = "text",
      placeholder,
      min,
      max,
      step,
    }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none
                    focus:ring-2 focus:ring-secondary transition
                    ${errors[name] ? "border-red-400" : "border-gray-200"}`}
        />
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );

     const Select = ({ label, name, options }) => (
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           {label}
         </label>
         <div className="relative">
           <select
             name={name}
             value={form[name]}
             onChange={handleChange}
             className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                     text-sm outline-none focus:ring-2 focus:ring-secondary
                     transition appearance-none bg-white"
           >
             {options.map((o) => (
               <option key={o.value} value={o.value}>
                 {o.label}
               </option>
             ))}
           </select>
           <ChevronDown
             className="w-4 h-4 text-gray-400 absolute right-3 top-3
                                pointer-events-none"
           />
         </div>
       </div>
     );
}