import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { formatINR } from "../utils/formatCurrency"
import { validatePredictForm } from "../utils/validateForm"
import {
  MapPin, TrendingUp, Award, AlertCircle,
  BarChart3, ChevronDown
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"

const CITIES = {
  "Mumbai, Maharashtra": { region: "west", multiplier: 1.25, tier: 1 },
  "Delhi NCR": { region: "north", multiplier: 1.20, tier: 1 },
  "Bangalore, Karnataka": { region: "south", multiplier: 1.18, tier: 1 },
  "Hyderabad, Telangana": { region: "south", multiplier: 1.15, tier: 1 },
  "Chennai, Tamil Nadu": { region: "south", multiplier: 1.12, tier: 1 },
  "Pune, Maharashtra": { region: "west", multiplier: 1.10, tier: 1 },
  "Kolkata, West Bengal": { region: "east", multiplier: 1.08, tier: 1 },
  "Ahmedabad, Gujarat": { region: "west", multiplier: 1.05, tier: 2 },
  "Jaipur, Rajasthan": { region: "north", multiplier: 1.00, tier: 2 },
  "Lucknow, Uttar Pradesh": { region: "north", multiplier: 0.98, tier: 2 },
  "Chandigarh": { region: "north", multiplier: 0.95, tier: 2 },
  "Indore, Madhya Pradesh": { region: "central", multiplier: 0.92, tier: 2 },
  "Bhubaneswar, Odisha": { region: "east", multiplier: 0.90, tier: 3 },
  "Coimbatore, Tamil Nadu": { region: "south", multiplier: 0.88, tier: 3 },
  "Vijayawada, Andhra Pradesh": { region: "south", multiplier: 0.85, tier: 3 },
}

export default function CityComparison() {
  const [form, setForm] = useState({
    age: "35",
    bmi: "24",
    smoker: false,
    insurance_type: "health",
  });
  const [selectedCities, setSelectedCities] = useState([
    "Mumbai, Maharashtra",
    "Delhi NCR",
    "Bangalore, Karnataka",
  ]);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 2) {
        setSelectedCities(selectedCities.filter((c) => c !== city));
      }
    } else {
      if (selectedCities.length < 5) {
        setSelectedCities([...selectedCities, city]);
      }
    }
  };

  const calculatePremiums = () => {
    const errs = validatePredictForm({
      ...form,
      sex: "male",
      children: "0",
      region: "northeast",
    });
    if (
      Object.keys(errs).filter(
        (k) => k !== "sex" && k !== "children" && k !== "region",
      ).length
    ) {
      return setErrors(errs);
    }

    let base = 5000;

    const age = parseInt(form.age);
    if (age < 25) base *= 1.1;
    else if (age < 35) base *= 1.2;
    else if (age < 45) base *= 1.5;
    else if (age < 55) base *= 1.8;
    else base *= 2.2;

    const bmi = parseFloat(form.bmi);
    if (bmi < 18.5) base *= 1.1;
    else if (bmi >= 25 && bmi < 30) base *= 1.2;
    else if (bmi >= 30) base *= 1.5;

    if (form.smoker) base *= 2;

    // Calculate for each city
    const cityResults = selectedCities
      .map((city) => {
        const cityData = CITIES[city];
        const premium = Math.round(base * cityData.multiplier);
        return {
          city,
          premium,
          multiplier: cityData.multiplier,
          tier: cityData.tier,
          region: cityData.region,
        };
      })
      .sort((a, b) => a.premium - b.premium);

    const cheapest = cityResults[0];
    const mostExpensive = cityResults[cityResults.length - 1];

    setResult({
      cityResults,
      cheapest,
      mostExpensive,
      difference: mostExpensive.premium - cheapest.premium,
      savingsPercent: Math.round(
        ((mostExpensive.premium - cheapest.premium) / mostExpensive.premium) *
          100,
      ),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 bg-[#2E86AB]/10
                          text-[#2E86AB] px-4 py-1.5 rounded-full text-sm
                          font-medium mb-4"
          >
            <MapPin className="w-4 h-4" /> City-wise Premium Comparison
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">
            Compare Premium Across Cities
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Same profile, different cities — see how location affects your
            premium
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-1 bg-white rounded-3xl border
                          border-gray-100 shadow-sm p-6"
          >
            <h2 className="font-bold text-[#1E3A5F] mb-4">Your Profile</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-semibold
                                  text-gray-700 mb-1.5"
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  className={`w-full px-4 py-3 rounded-xl border text-sm
                              outline-none focus:ring-2 focus:ring-[#2E86AB]
                              ${errors.age ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-semibold
                                  text-gray-700 mb-1.5"
                >
                  BMI
                </label>
                <input
                  type="number"
                  name="bmi"
                  value={form.bmi}
                  onChange={handleChange}
                  min="10"
                  max="60"
                  step="0.1"
                  className={`w-full px-4 py-3 rounded-xl border text-sm
                              outline-none focus:ring-2 focus:ring-[#2E86AB]
                              ${errors.bmi ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.bmi && (
                  <p className="text-red-500 text-xs mt-1">{errors.bmi}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-semibold
                                  text-gray-700 mb-1.5"
                >
                  Insurance Type
                </label>
                <div className="relative">
                  <select
                    name="insurance_type"
                    value={form.insurance_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border
                               border-gray-200 text-sm outline-none
                               focus:ring-2 focus:ring-[#2E86AB]
                               appearance-none bg-white"
                  >
                    <option value="health">🏥 Health</option>
                    <option value="life">💼 Life</option>
                    <option value="auto">🚗 Auto</option>
                    <option value="home">🏠 Home</option>
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-gray-400 absolute
                                          right-3 top-3.5 pointer-events-none"
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-between p-4
                              bg-gray-50 rounded-xl border border-gray-200"
              >
                <span className="text-sm font-semibold text-gray-700">
                  🚬 Smoker
                </span>
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
                    className="w-11 h-6 bg-gray-200 rounded-full peer
                                  peer-checked:bg-red-500 transition"
                  />
                  <div
                    className="absolute left-1 top-1 w-4 h-4 bg-white
                                  rounded-full transition
                                  peer-checked:translate-x-5 shadow"
                  />
                </label>
              </div>
            </div>
          </div>

          <div
            className="lg:col-span-2 bg-white rounded-3xl border
                          border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1E3A5F]">Select Cities (2-5)</h2>
              <span className="text-sm text-gray-500">
                {selectedCities.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {Object.keys(CITIES).map((city) => (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  disabled={
                    !selectedCities.includes(city) && selectedCities.length >= 5
                  }
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium
                              transition border-2
                    ${
                      selectedCities.includes(city)
                        ? "bg-[#2E86AB] text-white border-[#2E86AB]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#2E86AB]"
                    }
                    ${
                      !selectedCities.includes(city) &&
                      selectedCities.length >= 5
                        ? "opacity-30 cursor-not-allowed"
                        : ""
                    }`}
                >
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {city.split(",")[0]}
                  <span
                    className={`ml-1 text-xs
                    ${
                      CITIES[city].tier === 1
                        ? "text-yellow-400"
                        : CITIES[city].tier === 2
                          ? "text-blue-400"
                          : "text-green-400"
                    }`}
                  >
                    T{CITIES[city].tier}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={calculatePremiums}
              disabled={selectedCities.length < 2}
              className="w-full bg-linear-to-r from-[#2E86AB]
                         to-[#1E3A5F] text-white font-semibold py-3.5
                         rounded-2xl transition flex items-center
                         justify-center gap-2 shadow-lg hover:opacity-90
                         disabled:opacity-50"
            >
              <BarChart3 className="w-5 h-5" />
              Compare Premiums Across Cities
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 flex flex-col gap-6">
            {/* Savings Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="bg-linear-to-r from-green-500 to-green-600
                              rounded-3xl p-6 text-white"
              >
                <Award className="w-8 h-8 mb-3 text-green-200" />
                <p className="text-green-100 text-sm mb-1">Cheapest City</p>
                <p className="text-2xl font-bold mb-1">
                  {result.cheapest.city}
                </p>
                <p className="text-3xl font-bold">
                  {formatINR(result.cheapest.premium)}
                </p>
              </div>

              <div
                className="bg-linear-to-r from-orange-500 to-orange-600
                              rounded-3xl p-6 text-white"
              >
                <AlertCircle className="w-8 h-8 mb-3 text-orange-200" />
                <p className="text-orange-100 text-sm mb-1">
                  Potential Savings
                </p>
                <p className="text-3xl font-bold mb-1">
                  {formatINR(result.difference)}
                </p>
                <p className="text-sm text-orange-100">
                  {result.savingsPercent}% cheaper than{" "}
                  {result.mostExpensive.city.split(",")[0]}
                </p>
              </div>
            </div>

            <div
              className="bg-white rounded-3xl border border-gray-100
                            shadow-sm p-6"
            >
              <h3 className="font-bold text-[#1E3A5F] mb-6">
                📊 Premium Comparison Chart
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.cityResults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="city"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(v) => formatINR(v)}
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="premium" fill="#2E86AB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="bg-white rounded-3xl border border-gray-100
                            shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-[#1E3A5F]">Detailed Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold
                                     text-gray-500"
                      >
                        Rank
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold
                                     text-gray-500"
                      >
                        City
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold
                                     text-gray-500"
                      >
                        Region
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold
                                     text-gray-500"
                      >
                        Tier
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold
                                     text-gray-500"
                      >
                        Multiplier
                      </th>
                      <th
                        className="px-6 py-3 text-right text-xs font-semibold
                                     text-gray-500"
                      >
                        Annual Premium
                      </th>
                      <th
                        className="px-6 py-3 text-right text-xs font-semibold
                                     text-gray-500"
                      >
                        vs Cheapest
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.cityResults.map((c, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-100
                                             hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          {i === 0 ? (
                            <span
                              className="inline-flex items-center justify-center
                                             w-6 h-6 bg-green-100 text-green-600
                                             rounded-full text-xs font-bold"
                            >
                              1
                            </span>
                          ) : (
                            <span className="text-gray-400 font-medium">
                              {i + 1}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin
                              className={`w-4 h-4
                              ${i === 0 ? "text-green-500" : "text-gray-400"}`}
                            />
                            <span className="font-medium text-gray-700">
                              {c.city}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 capitalize text-xs">
                            {c.region}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs
                                           font-medium
                            ${
                              c.tier === 1
                                ? "bg-yellow-100 text-yellow-700"
                                : c.tier === 2
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            Tier {c.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-medium
                            ${
                              c.multiplier > 1
                                ? "text-red-600"
                                : c.multiplier < 1
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {c.multiplier > 1 ? "+" : ""}
                            {((c.multiplier - 1) * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-bold text-lg
                            ${
                              i === 0
                                ? "text-green-600"
                                : i === result.cityResults.length - 1
                                  ? "text-red-600"
                                  : "text-gray-700"
                            }`}
                          >
                            {formatINR(c.premium)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {i === 0 ? (
                            <span className="text-xs text-green-600 font-medium">
                              Cheapest ✓
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 font-medium">
                              +{formatINR(c.premium - result.cheapest.premium)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="bg-linear-to-r from-blue-50 to-indigo-50
                            border border-blue-100 rounded-3xl p-6"
            >
              <h3 className="font-bold text-[#1E3A5F] mb-4">💡 Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: "🏙️",
                    title: "Metropolitan Premium",
                    text: `Tier-1 cities like Mumbai and Delhi have 15-25% higher premiums due to higher medical costs and claim frequency.`,
                  },
                  {
                    icon: "🌆",
                    title: "Tier-2 & Tier-3 Advantage",
                    text: `Smaller cities offer 10-20% lower premiums while still providing good healthcare infrastructure.`,
                  },
                  {
                    icon: "📍",
                    title: "Location Matters",
                    text: `You could save ${formatINR(result.difference)} per year just by choosing the right city for your policy.`,
                  },
                  {
                    icon: "💰",
                    title: "Best Value",
                    text: `${result.cheapest.city} offers the best premium rate with a ${result.cheapest.multiplier}x multiplier.`,
                  },
                ].map((insight, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-blue-100
                               p-4 flex gap-3"
                  >
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-1">
                        {insight.title}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {insight.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-amber-50 border border-amber-200 rounded-2xl
                            px-5 py-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Important Note
                </p>
                <p className="text-sm text-amber-700">
                  These are estimated premiums based on city multipliers. Actual
                  premiums may vary by insurer. Always check with multiple
                  insurance companies for final quotes.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}