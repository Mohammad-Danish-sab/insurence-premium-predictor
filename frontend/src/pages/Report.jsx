import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatINR } from "../utils/formatCurrency";
import { downloadReport } from "../services/predictService";
import api from "../services/api";
import {
  FileText,
  Download,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Shield,
  Loader,
} from "lucide-react";

const riskColor = (level) =>
  ({
    Low: "text-green-600  bg-green-50  border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    High: "text-orange-600 bg-orange-50 border-orange-200",
    "Very High": "text-red-600    bg-red-50    border-red-200",
  })[level] || "text-gray-600 bg-gray-50 border-gray-200";

export default function Report() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false); // ← Fix 1

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/history/${id}`);
        setData(res.data);
      } catch {
        setError("Prediction not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ← Fix 2: async download
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 border-4 border-[#2E86AB]
                        border-t-transparent rounded-full animate-spin"
          />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div
          className="flex-1 flex flex-col items-center
                      justify-center gap-4"
        >
          <p className="text-gray-500">{error}</p>
          <Link
            to="/history"
            className="text-[#2E86AB] hover:underline text-sm"
          >
            ← Back to History
          </Link>
        </div>
      </div>
    );

  const { input, result } = data;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/history"
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#1E3A5F]">
                Insurance Report
              </h1>
              <p className="text-gray-500 text-sm">Full prediction breakdown</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#2E86AB]
                       hover:bg-[#1E3A5F] text-white text-sm font-semibold
                       px-5 py-2.5 rounded-full transition
                       disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download PDF
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div
            className="bg-linear-to-br from-[#1E3A5F] to-[#2E86AB]
                          text-white rounded-3xl p-8"
          >
            <div
              className="flex flex-col sm:flex-row justify-between
                            items-start sm:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-200 text-sm capitalize">
                    {input?.insurance_type} Insurance
                  </span>
                </div>
                <p className="text-5xl font-bold mb-2">
                  {formatINR(result?.predicted_premium)}
                </p>
                <p className="text-blue-200 text-sm">
                  Confidence Range: {formatINR(result?.confidence_range?.min)}
                  {" — "}
                  {formatINR(result?.confidence_range?.max)}
                </p>
              </div>
              <div
                className={`rounded-2xl border-2 px-6 py-4 text-center
                              ${riskColor(result?.risk_level)}`}
              >
                <p className="text-4xl font-bold">{result?.risk_score}</p>
                <p className="text-sm font-medium">Risk Score</p>
                <p className="text-xs mt-0.5">{result?.risk_level} Risk</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-6"
          >
            <h2
              className="font-semibold text-[#1E3A5F] mb-4
                           flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Input Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Age", value: `${input?.age} years` },
                {
                  label: "Gender",
                  value:
                    input?.sex?.charAt(0).toUpperCase() + input?.sex?.slice(1),
                },
                { label: "BMI", value: input?.bmi },
                { label: "Children", value: input?.children },
                { label: "Smoker", value: input?.smoker ? "Yes" : "No" },
                {
                  label: "Region",
                  value:
                    input?.region?.charAt(0).toUpperCase() +
                    input?.region?.slice(1),
                },
                {
                  label: "Type",
                  value:
                    input?.insurance_type?.charAt(0).toUpperCase() +
                    input?.insurance_type?.slice(1),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-3 border
                             border-gray-100"
                >
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-6"
          >
            <h2
              className="font-semibold text-[#1E3A5F] mb-4
                           flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Top Factors
            </h2>
            <div className="flex flex-col gap-3">
              {result?.top_factors?.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4
                             rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-8 rounded-full
                      ${
                        f.direction === "increases"
                          ? "bg-red-400"
                          : "bg-green-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {f.factor}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold
                    ${
                      f.direction === "increases"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {f.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-6"
          >
            <h2 className="font-semibold text-[#1E3A5F] mb-4">
              📦 Plan Comparison
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result?.plan_comparison &&
                Object.values(result.plan_comparison).map((plan, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-5
                      ${
                        i === 1
                          ? "border-[#2E86AB] bg-blue-50 shadow"
                          : "border-gray-100 bg-gray-50"
                      }`}
                  >
                    {i === 1 && (
                      <span
                        className="text-xs bg-[#2E86AB] text-white
                                       px-2 py-0.5 rounded-full mb-3
                                       inline-block"
                      >
                        ⭐ Recommended
                      </span>
                    )}
                    <p className="font-bold text-[#1E3A5F] text-lg">
                      {plan.plan_name}
                    </p>
                    <p className="text-2xl font-bold text-[#2E86AB] my-2">
                      {formatINR(plan.premium)}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Coverage: {formatINR(plan.coverage_amount)}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Deductible: {formatINR(plan.deductible)}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {plan.features.map((f, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-1.5 text-xs
                                     text-gray-600"
                        >
                          <CheckCircle
                            className="w-3.5 h-3.5 text-green-500
                                                  mt-0.5 shrink-0"
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
            className="bg-amber-50 border border-amber-200
                          rounded-2xl p-5 flex gap-3"
          >
            <AlertTriangle
              className="w-5 h-5 text-amber-500
                                      shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                💡 Recommendation
              </p>
              <p className="text-sm text-amber-700">{result?.recommendation}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2
                         bg-[#1E3A5F] hover:bg-[#2E86AB] text-white
                         font-semibold px-6 py-3.5 rounded-2xl
                         transition text-sm disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PDF Report
                </>
              )}
            </button>
            <Link
              to="/history"
              className="flex-1 flex items-center justify-center gap-2
                         bg-white border-2 border-gray-200
                         hover:border-[#2E86AB] text-gray-700
                         font-semibold px-6 py-3.5 rounded-2xl
                         transition text-sm"
            >
              ← Back to History
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
