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
  Calculator,
  X,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShareWhatsApp from "../components/ShareWhatsApp";
import InsuranceCompanies from "../components/InsuranceCompanies";

const riskColor = (level) =>
  ({
    Low: "text-green-600  bg-green-50  border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    High: "text-orange-600 bg-orange-50 border-orange-200",
    "Very High": "text-red-600    bg-red-50    border-red-200",
  })[level] || "text-gray-600 bg-gray-50 border-gray-200";

export default function Predict() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    age: "",
    sex: "male",
    bmi: "",
    children: "0",
    smoker: false,
    region: "northeast",
    insurance_type: "health",
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const [showBMI, setShowBMI] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePredictForm(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setApiErr("");
    setResult(null);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        bmi: parseFloat(form.bmi),
        children: parseInt(form.children),
      };
      const res = user
        ? await predictPremium(payload)
        : await predictGuest(payload);
      setResult(res);
      setTimeout(
        () =>
          document
            .getElementById("result")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch (err) {
      setApiErr(err.response?.data?.detail || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (!height || !weight) return;
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    const bmi = (w / (h * h)).toFixed(1);

    let category = "";
    let color = "";
    let tip = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-600";
      tip = "Being underweight may slightly increase your premium.";
    } else if (bmi < 25) {
      category = "Normal Weight";
      color = "text-green-600";
      tip = "Great! Normal BMI gives you the best premium rates.";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-600";
      tip = "Overweight BMI increases your premium by ~20%.";
    } else {
      category = "Obese";
      color = "text-red-600";
      tip = "Obese BMI can increase your premium by up to 50%.";
    }

    setBmiResult({ bmi, category, color, tip });

    setForm((prev) => ({ ...prev, bmi }));
  };

  const Select = ({ label, name, options }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200
                     text-sm outline-none focus:ring-2 focus:ring-[#2E86AB]
                     transition appearance-none bg-white"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="w-4 h-4 text-gray-400 absolute
                                right-3 top-3.5 pointer-events-none"
        />
      </div>
    </div>
  );

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
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
        className={`w-full px-4 py-3 rounded-xl border text-sm
                    outline-none focus:ring-2 focus:ring-[#2E86AB]
                    transition bg-white
                    ${
                      errors[name]
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">⚠ {errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 bg-[#2E86AB]/10
                          text-[#2E86AB] px-4 py-1.5 rounded-full text-sm
                          font-medium mb-4"
          >
            <Shield className="w-4 h-4" /> Insurance Premium Calculator
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">
            Get Your Instant Quote
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Fill in your details for an accurate premium prediction
          </p>
          {!user && (
            <div
              className="inline-flex items-center gap-2 bg-amber-50
                            border border-amber-200 text-amber-700 text-xs
                            px-4 py-2 rounded-full mt-3"
            >
              <Info className="w-3.5 h-3.5" />
              Guest mode — predictions won't be saved.{" "}
              <Link to="/signup" className="font-semibold underline">
                Sign up free
              </Link>
            </div>
          )}
        </div>

        {showBMI && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center
                          justify-center z-50 px-4"
          >
            <div
              className="bg-white rounded-3xl p-8 w-full max-w-md
                            shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 bg-[#2E86AB]/10 rounded-xl
                                  flex items-center justify-center"
                  >
                    <Calculator className="w-5 h-5 text-[#2E86AB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F]">BMI Calculator</h3>
                    <p className="text-xs text-gray-400">
                      Auto-fills your BMI in the form
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowBMI(false);
                    setBmiResult(null);
                  }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200
                             rounded-full flex items-center justify-center
                             transition"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-4 py-3 rounded-xl border
                               border-gray-200 text-sm outline-none
                               focus:ring-2 focus:ring-[#2E86AB]"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full px-4 py-3 rounded-xl border
                               border-gray-200 text-sm outline-none
                               focus:ring-2 focus:ring-[#2E86AB]"
                  />
                </div>

                <button
                  onClick={calculateBMI}
                  className="w-full bg-[#2E86AB] hover:bg-[#1E3A5F]
                             text-white font-semibold py-3 rounded-xl
                             transition"
                >
                  Calculate BMI
                </button>

                {bmiResult && (
                  <div
                    className="bg-gray-50 rounded-2xl p-5 border
                                  border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">Your BMI</span>
                      <span
                        className={`text-3xl font-bold
                                       ${bmiResult.color}`}
                      >
                        {bmiResult.bmi}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex rounded-full overflow-hidden h-2 mb-1">
                        <div className="flex-1 bg-blue-400" />
                        <div className="flex-1 bg-green-400" />
                        <div className="flex-1 bg-yellow-400" />
                        <div className="flex-1 bg-red-400" />
                      </div>
                      <div
                        className="flex justify-between text-xs
                                      text-gray-400"
                      >
                        <span>Under</span>
                        <span>Normal</span>
                        <span>Over</span>
                        <span>Obese</span>
                      </div>
                    </div>

                    <p className={`font-bold text-sm mb-1 ${bmiResult.color}`}>
                      {bmiResult.category}
                    </p>
                    <p className="text-xs text-gray-500">{bmiResult.tip}</p>

                    <button
                      onClick={() => setShowBMI(false)}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600
                                 text-white font-semibold py-2.5 rounded-xl
                                 transition text-sm"
                    >
                      ✅ Use This BMI ({bmiResult.bmi})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 bg-white rounded-3xl border
                          border-gray-100 shadow-sm p-8"
          >
            {/* BMI Calculator Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-[#1E3A5F]">Your Details</h2>
              <button
                onClick={() => setShowBMI(true)}
                className="flex items-center gap-2 bg-[#2E86AB]/10
                           hover:bg-[#2E86AB]/20 text-[#2E86AB] text-sm
                           font-semibold px-4 py-2 rounded-xl transition"
              >
                <Calculator className="w-4 h-4" /> BMI Calculator
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Age"
                  name="age"
                  type="number"
                  placeholder="e.g. 35"
                  min="18"
                  max="100"
                />

                <div>
                  <label
                    className="block text-sm font-semibold
                                    text-gray-700 mb-1.5"
                  >
                    BMI{" "}
                    <button
                      type="button"
                      onClick={() => setShowBMI(true)}
                      className="text-[#2E86AB] text-xs font-normal
                                 hover:underline ml-1"
                    >
                      (Don't know? Calculate →)
                    </button>
                  </label>
                  <input
                    type="number"
                    name="bmi"
                    value={form.bmi}
                    onChange={handleChange}
                    placeholder="e.g. 25.5"
                    min="10"
                    max="60"
                    step="0.1"
                    className={`w-full px-4 py-3 rounded-xl border text-sm
                                outline-none focus:ring-2 focus:ring-[#2E86AB]
                                transition bg-white
                                ${
                                  errors.bmi
                                    ? "border-red-400 bg-red-50"
                                    : "border-gray-200"
                                }`}
                  />
                  {errors.bmi && (
                    <p className="text-red-500 text-xs mt-1">⚠ {errors.bmi}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Gender"
                  name="sex"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: " Female" },
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
                    { value: "northeast", label: "🗺 Northeast" },
                    { value: "northwest", label: "🗺 Northwest" },
                    { value: "southeast", label: "🗺 Southeast" },
                    { value: "southwest", label: "🗺 Southwest" },
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
                className={`flex items-center justify-between p-4
                              rounded-2xl border transition
                              ${
                                form.smoker
                                  ? "bg-red-50 border-red-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    🚬 Smoker
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {form.smoker
                      ? "⚠️ Smoking increases premium by up to 100%"
                      : "Non-smokers get significantly lower rates"}
                  </p>
                </div>
                <label
                  className="relative inline-flex items-center
                                  cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="smoker"
                    checked={form.smoker}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div
                    className="w-12 h-6 bg-gray-200 peer-focus:ring-2
                                  peer-focus:ring-[#2E86AB] rounded-full peer
                                  peer-checked:bg-red-500 transition"
                  />
                  <div
                    className="absolute left-1 top-1 w-4 h-4 bg-white
                                  rounded-full transition
                                  peer-checked:translate-x-6 shadow"
                  />
                </label>
              </div>

              {apiErr && (
                <div
                  className="flex items-center gap-2 bg-red-50 border
                                border-red-200 text-red-600 text-sm
                                rounded-xl px-4 py-3"
                >
                  ⚠️ {apiErr}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#2E86AB]
                           to-[#1E3A5F] hover:from-[#1E3A5F]
                           hover:to-[#2E86AB] text-white font-semibold
                           py-4 rounded-2xl transition-all duration-300
                           flex items-center justify-center gap-2
                           disabled:opacity-60 shadow-lg
                           shadow-blue-200 text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Calculating your premium...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Get My Insurance Quote
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-4">
            {/* Info cards */}
            {[
              {
                icon: <Shield className="w-5 h-5 text-[#2E86AB]" />,
                title: "Accurate Estimates",
                desc: "Based on real insurance industry factors.",
                bg: "bg-blue-50",
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-green-600" />,
                title: "Risk Analysis",
                desc: "Personal risk score with key factors.",
                bg: "bg-green-50",
              },
              {
                icon: <FileText className="w-5 h-5 text-orange-600" />,
                title: "PDF Report",
                desc: "Download professional insurance report.",
                bg: "bg-orange-50",
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-purple-600" />,
                title: "Plan Comparison",
                desc: "Basic, Standard and Premium plans.",
                bg: "bg-purple-50",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100
                           shadow-sm p-4 flex gap-3 hover:shadow-md
                           transition"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center
                                justify-center shrink-0 ${c.bg}`}
                >
                  {c.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E3A5F]">
                    {c.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}

            <div
              className="bg-white rounded-2xl border border-gray-100
                            shadow-sm p-4"
            >
              <p className="text-sm font-semibold text-[#1E3A5F] mb-3">
                📊 BMI Reference
              </p>
              {[
                { range: "< 18.5", label: "Underweight", color: "bg-blue-400" },
                { range: "18.5–24.9", label: "Normal", color: "bg-green-400" },
                {
                  range: "25–29.9",
                  label: "Overweight",
                  color: "bg-yellow-400",
                },
                { range: "≥ 30", label: "Obese", color: "bg-red-400" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                  <div className={`w-3 h-3 rounded-full ${b.color}`} />
                  <span className="text-xs text-gray-500">{b.range}</span>
                  <span className="text-xs font-medium text-gray-700 ml-auto">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div id="result" className="mt-10 flex flex-col gap-5">
            {/* Success banner */}
            <div
              className="bg-green-50 border border-green-200
                            rounded-2xl px-5 py-3 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 text-sm font-medium">
                Your insurance premium has been calculated successfully!
              </p>
            </div>

            {/* Premium + Risk */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="sm:col-span-2 bg-linear-to-br
                              from-[#1E3A5F] to-[#2E86AB] text-white
                              rounded-3xl p-8"
              >
                <p className="text-blue-200 text-sm mb-2">
                  Your Predicted Annual Premium
                </p>
                <p className="text-5xl font-bold mb-3">
                  {formatINR(result.predicted_premium)}
                </p>
                <p className="text-sm text-blue-200">
                  Confidence Range:{" "}
                  <span className="text-white font-medium">
                    {formatINR(result.confidence_range.min)}
                  </span>
                  {" — "}
                  <span className="text-white font-medium">
                    {formatINR(result.confidence_range.max)}
                  </span>
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full bg-green-400
                                  animate-pulse"
                  />
                  <span className="text-xs text-blue-200">
                    Calculated just now
                  </span>
                </div>
              </div>

              <div
                className={`rounded-3xl border-2 p-6 flex flex-col
                              items-center justify-center text-center
                              ${riskColor(result.risk_level)}`}
              >
                <AlertTriangle className="w-10 h-10 mb-2" />
                <p className="text-5xl font-bold">{result.risk_score}</p>
                <p className="text-sm font-bold mt-1">Risk Score</p>
                <p className="text-xs mt-1 opacity-75">out of 100</p>
                <div
                  className="mt-3 px-3 py-1 rounded-full bg-white/50
                                text-xs font-bold"
                >
                  {result.risk_level} Risk
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-3xl border border-gray-100
                            shadow-sm p-6"
            >
              <h3 className="font-bold text-[#1E3A5F] mb-4">
                📊 Factors Affecting Your Premium
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.top_factors.map((f, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border
                      ${
                        f.direction === "increases"
                          ? "bg-red-50 border-red-100"
                          : "bg-green-50 border-green-100"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2 h-8 rounded-full
                        ${
                          f.direction === "increases"
                            ? "bg-red-400"
                            : "bg-green-400"
                        }`}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {f.factor}
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold
                      ${
                        f.direction === "increases"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {f.impact}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                      {f.direction} premium
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-white rounded-3xl border border-gray-100
                            shadow-sm p-6"
            >
              <h3 className="font-bold text-[#1E3A5F] mb-4">
                📦 Plan Comparison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.values(result.plan_comparison).map((plan, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-5 transition
                      ${
                        i === 1
                          ? "border-[#2E86AB] bg-[#2E86AB]/5 shadow-lg"
                          : "border-gray-100 bg-gray-50"
                      }`}
                  >
                    {i === 1 && (
                      <div className="flex justify-center mb-2">
                        <span
                          className="text-xs bg-[#2E86AB] text-white
                                         px-3 py-0.5 rounded-full font-medium"
                        >
                          ⭐ Recommended
                        </span>
                      </div>
                    )}
                    <p className="font-bold text-[#1E3A5F] text-center mb-1">
                      {plan.plan_name}
                    </p>
                    <p
                      className="text-2xl font-bold text-[#2E86AB]
                                  text-center my-3"
                    >
                      {formatINR(plan.premium)}
                    </p>
                    <p className="text-xs text-gray-500 text-center mb-1">
                      Coverage: {formatINR(plan.coverage_amount)}
                    </p>
                    <p className="text-xs text-gray-500 text-center mb-4">
                      Deductible: {formatINR(plan.deductible)}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {plan.features.map((f, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-1.5 text-xs
                                     text-gray-600"
                        >
                          <CheckCircle
                            className="w-3.5 h-3.5 text-green-500
                                                  shrink-0 mt-0.5"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-linear-to-r from-amber-50 to-orange-50
                            border border-amber-200 rounded-3xl p-5
                            flex gap-3"
            >
              <div
                className="w-10 h-10 bg-amber-100 rounded-xl flex
                              items-center justify-center shrink-0"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-amber-800 mb-1">
                  💡 Personalized Recommendation
                </p>
                <p className="text-sm text-amber-700">
                  {result.recommendation}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {user && (
                <Link
                  to="/history"
                  className="flex-1 flex items-center justify-center gap-2
                             bg-[#1E3A5F] hover:bg-[#2E86AB] text-white
                             font-semibold px-6 py-3.5 rounded-2xl
                             transition text-sm"
                >
                  <FileText className="w-4 h-4" />
                  View & Download Report
                </Link>
              )}

              <ShareWhatsApp result={result} input={form} />

              <button
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex-1 flex items-center justify-center gap-2
                           bg-white border-2 border-gray-200
                           hover:border-[#2E86AB] text-gray-700
                           font-semibold px-6 py-3.5 rounded-2xl
                           transition text-sm"
              >
                🔄 Calculate Again
              </button>
            </div>

            <InsuranceCompanies result={result} input={form} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
