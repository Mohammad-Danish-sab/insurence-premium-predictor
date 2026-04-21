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
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />

          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-primary">
                Get Your Insurance Quote
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Fill in your details below to get an instant premium prediction
              </p>
              {!user && (
                <p className="text-xs text-accent mt-2">
                  ⚠️ You're using guest mode.{" "}
                  <Link to="/signup" className="underline text-secondary">
                    Sign up
                  </Link>{" "}
                  to save your predictions.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="lg:col-span-2 bg-white rounded-2xl border
                          border-gray-100 shadow-sm p-8"
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      label="Age"
                      name="age"
                      type="number"
                      placeholder="35"
                      min="18"
                      max="100"
                    />
                    <Field
                      label="BMI"
                      name="bmi"
                      type="number"
                      placeholder="25.5"
                      min="10"
                      max="60"
                      step="0.1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                      label="Gender"
                      name="sex"
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                    />
                    <Field
                      label="Number of Children"
                      name="children"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                      label="Region"
                      name="region"
                      options={[
                        { value: "northeast", label: "Northeast" },
                        { value: "northwest", label: "Northwest" },
                        { value: "southeast", label: "Southeast" },
                        { value: "southwest", label: "Southwest" },
                      ]}
                    />
                    <Select
                      label="Insurance Type"
                      name="insurance_type"
                      options={[
                        { value: "health", label: "🏥 Health" },
                        { value: "life", label: "💼 Life" },
                        { value: "auto", label: "🚗 Auto" },
                        { value: "home", label: "🏠 Home" },
                      ]}
                    />
                  </div>
                  <div
                    className="flex items-center justify-between p-4 rounded-xl
                              border border-gray-200 bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Smoker
                      </p>
                      <p className="text-xs text-gray-400">
                        Smoking significantly increases your premium
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="smoker"
                        checked={form.smoker}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:ring-2
                                  peer-focus:ring-secondary rounded-full peer
                                  peer-checked:bg-secondary transition"
                      />
                      <div
                        className="absolute left-1 top-1 w-4 h-4 bg-white
                                  rounded-full transition peer-checked:translate-x-5"
                      />
                    </label>
                  </div>

                  {apiErr && (
                    <p
                      className="text-red-500 text-sm bg-red-50 px-4 py-3
                              rounded-xl border border-red-200"
                    >
                      {apiErr}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary hover:bg-primary text-white
                           font-semibold py-3 rounded-xl transition flex
                           items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />{" "}
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" /> Get My Quote
                      </>
                    )}
                  </button>
                </form>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: <Shield className="w-5 h-5 text-secondary" />,
                    title: "Accurate Estimates",
                    desc: "Our rule-based engine uses real insurance factors.",
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5 text-success" />,
                    title: "Risk Analysis",
                    desc: "Get a personal risk score with key factors.",
                  },
                  {
                    icon: <FileText className="w-5 h-5 text-accent" />,
                    title: "PDF Report",
                    desc: "Download a professional report of your quote.",
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5 text-primary" />,
                    title: "Plan Comparison",
                    desc: "Basic, Standard and Premium plans compared.",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100
                           shadow-sm p-4 flex gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl bg-gray-50 flex
                                items-center justify-center shrink-0"
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {c.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {result && (
              <div id="result" className="mt-10 flex flex-col gap-6">
                {/* Premium + Risk */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className="sm:col-span-2 bg-linear-to-br from-primary
                              to-secondary text-white rounded-2xl p-6"
                  >
                    <p className="text-sm text-blue-200 mb-1">
                      Predicted Premium
                    </p>
                    <p className="text-4xl font-bold mb-1">
                      {formatINR(result.predicted_premium)}
                    </p>
                    <p className="text-sm text-blue-200">
                      Range: {formatINR(result.confidence_range.min)} —{" "}
                      {formatINR(result.confidence_range.max)}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl border p-6 flex flex-col
                              items-center justify-center text-center
                              ${riskColor(result.risk_level)}`}
                  >
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    <p className="text-3xl font-bold">{result.risk_score}</p>
                    <p className="text-sm font-medium mt-1">Risk Score</p>
                    <p className="text-xs mt-0.5">{result.risk_level} Risk</p>
                  </div>
                </div>
                <div
                  className="bg-white rounded-2xl border border-gray-100
                            shadow-sm p-6"
                >
                  <h3 className="font-semibold text-primary mb-4">
                    Top Factors Affecting Your Premium
                  </h3>
                  <div className="flex flex-col gap-3">
                    {result.top_factors.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3
                               rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">
                          {f.factor}
                        </span>
                        <span
                          className={`text-sm font-semibold
                      ${
                        f.direction === "increases"
                          ? "text-danger"
                          : "text-success"
                      }`}
                        >
                          {f.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>     
              </div>
            )}
          </main>
        </div>
      );
}