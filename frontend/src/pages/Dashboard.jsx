import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getStats, getHistory } from "../services/predictService"
import { formatINR } from "../utils/formatCurrency"
import {
  BarChart2, TrendingUp, Shield, AlertTriangle,
  ArrowRight, Clock, FileText, Zap, Plus, Target, Award, ChevronRight, Activity
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts"

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("premium");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, h] = await Promise.all([getStats(), getHistory(1)]);
        setStats(s);
        setHistory(h.predictions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = history
    .slice(0, 7)
    .reverse()
    .map((p, i) => ({
      name: `#${i + 1}`,
      premium: p.result?.predicted_premium || 0,
      risk: p.result?.risk_score || 0,
    }));

  const riskColor = (level) =>
    ({
      Low: "bg-green-100  text-green-700",
      Medium: "bg-yellow-100 text-yellow-700",
      High: "bg-orange-100 text-orange-700",
      "Very High": "bg-red-100    text-red-700",
    })[level] || "bg-gray-100 text-gray-600";

  const statCards = [
    {
      label: "Total Predictions",
      value: stats?.total ?? 0,
      icon: <Zap className="w-5 h-5 text-secondary" />,
      bg: "bg-blue-50",
      light: "bg-blue-50  text-blue-600",
      change: "+12% this month",
    },
    {
      label: "Avg Premium",
      value: stats ? formatINR(stats.avg_premium) : "—",
      icon: <TrendingUp className="w-5 h-5 text-success" />,
      bg: "from-green-500  to-green-600",
      light: "bg-green-50 text-green-600",
      change: "Based on all quotes",
    },
    {
      label: "Highest Premium",
      value: stats ? formatINR(stats.max_premium) : "—",
      icon: <AlertTriangle className="w-5 h-5 text-accent" />,
      bg: "from-orange-500 to-orange-600",
      light: "bg-orange-50 text-orange-600",
      change: "Your maximum quote",
    },
    {
      label: "Avg Risk Score",
      value: stats ? `${stats.avg_risk_score} / 100` : "—",
      icon: <Shield className="w-5 h-5 text-danger" />,
      bg: "from-purple-500 to-purple-600",
      light: "bg-purple-50 text-purple-600",
      change: "Your average risk",
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-16 h-16 border-4 border-[#2E86AB] border-t-transparent
                          rounded-full animate-spin mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div
          className="bg-linear-to-r from-[#1E3A5F] via-[#2E86AB]
                        to-[#1E3A5F] rounded-3xl p-8 mb-8 text-white
                        relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-white
                          opacity-5 rounded-full -translate-y-32
                          translate-x-32"
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 bg-white
                          opacity-5 rounded-full translate-y-24
                          -translate-x-24"
          />
          <div
            className="relative z-10 flex flex-col sm:flex-row
                          justify-between items-start sm:items-center gap-4"
          >
            <div>
              <p className="text-blue-200 text-sm mb-1">👋 Welcome back</p>
              <h1 className="text-3xl font-bold mb-2">
                {user?.full_name?.split(" ")[0]}!
              </h1>
              <p className="text-blue-200 text-sm">
                You have made{" "}
                <span className="text-white font-bold">
                  {stats?.total ?? 0} predictions
                </span>{" "}
                so far. Keep tracking your insurance health!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/predict"
                className="flex items-center gap-2 bg-[#F4A261]
                           hover:bg-orange-500 text-white font-semibold
                           px-5 py-2.5 rounded-xl transition shadow-lg"
              >
                <Plus className="w-4 h-4" /> New Quote
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-2 bg-white/20
                           hover:bg-white/30 text-white font-semibold
                           px-5 py-2.5 rounded-xl transition backdrop-blur"
              >
                <Clock className="w-4 h-4" /> History
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100
                         shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center
                                justify-center text-white bg-linear-to-br
                                ${s.bg}`}
                >
                  {s.icon}
                </div>
                <span className="text-xs text-gray-400">↗</span>
              </div>
              <p className="text-2xl font-bold text-[#1E3A5F] mb-1">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-xs text-green-600">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div
            className="lg:col-span-2 bg-white rounded-2xl border
                          border-gray-100 shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-[#1E3A5F]">Analytics Overview</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your last 7 predictions
                </p>
              </div>
              <div className="flex gap-2">
                {["premium", "risk"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveChart(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium
                                transition capitalize
                      ${
                        activeChart === c
                          ? "bg-[#2E86AB] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorPremium"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2E86AB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2E86AB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) =>
                      activeChart === "premium" ? formatINR(v) : `${v}/100`
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  {activeChart === "premium" ? (
                    <Area
                      type="monotone"
                      dataKey="premium"
                      stroke="#2E86AB"
                      strokeWidth={2.5}
                      fill="url(#colorPremium)"
                      dot={{ r: 4, fill: "#2E86AB" }}
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#E63946"
                      strokeWidth={2.5}
                      fill="url(#colorRisk)"
                      dot={{ r: 4, fill: "#E63946" }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="h-52 flex flex-col items-center
                              justify-center text-gray-300"
              >
                <Activity className="w-12 h-12 mb-3" />
                <p className="text-sm font-medium">No data yet</p>
                <Link
                  to="/predict"
                  className="text-[#2E86AB] text-sm mt-2 hover:underline"
                >
                  Make your first prediction →
                </Link>
              </div>
            )}
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100
                          shadow-sm p-6"
          >
            <h2 className="font-bold text-[#1E3A5F] mb-5">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: <Zap className="w-5 h-5 text-blue-600" />,
                  label: "Get New Quote",
                  sub: "Instant prediction",
                  to: "/predict",
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
                {
                  icon: <Clock className="w-5 h-5 text-green-600" />,
                  label: "View History",
                  sub: "All past quotes",
                  to: "/history",
                  bg: "bg-green-50",
                  color: "text-green-600",
                },
                {
                  icon: <FileText className="w-5 h-5 text-orange-600" />,
                  label: "Download Report",
                  sub: "PDF export",
                  to: "/history",
                  bg: "bg-orange-50",
                  color: "text-orange-600",
                },
                {
                  icon: <Target className="w-5 h-5 text-purple-600" />,
                  label: "BMI Calculator",
                  sub: "Check your BMI",
                  to: "/predict",
                  bg: "bg-purple-50",
                  color: "text-purple-600",
                },
              ].map((a, i) => (
                <Link
                  key={i}
                  to={a.to}
                  className="flex items-center gap-3 p-3 rounded-xl
                             hover:bg-gray-50 border border-gray-100
                             transition group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center
                                  justify-center ${a.bg}`}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {a.label}
                    </p>
                    <p className="text-xs text-gray-400">{a.sub}</p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-gray-300
                                           group-hover:text-gray-500
                                           transition"
                  />
                </Link>
              ))}
            </div>

            {/* Profile Card */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div
                className="flex items-center gap-3 p-3 bg-linear-to-r
                              from-[#1E3A5F] to-[#2E86AB] rounded-xl"
              >
                <div
                  className="w-10 h-10 rounded-full bg-white/20 flex
                                items-center justify-center text-white
                                font-bold text-sm"
                >
                  {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-blue-200">{user?.email}</p>
                </div>
                <Award className="w-5 h-5 text-[#F4A261]" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-100
                        shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-[#1E3A5F]">Recent Predictions</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Your latest insurance quotes
              </p>
            </div>
            <Link
              to="/history"
              className="flex items-center gap-1 text-sm text-[#2E86AB]
                         hover:underline font-medium"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16">
              <div
                className="w-20 h-20 bg-gray-100 rounded-full flex
                              items-center justify-center mx-auto mb-4"
              >
                <Zap className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-500 mb-1">
                No predictions yet
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Get your first insurance quote in seconds
              </p>
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 bg-[#2E86AB]
                           text-white px-6 py-2.5 rounded-xl text-sm
                           font-semibold hover:bg-[#1E3A5F] transition"
              >
                <Plus className="w-4 h-4" /> Get First Quote
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 rounded-xl">
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold
                                   text-gray-500 rounded-l-xl"
                    >
                      #
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold
                                   text-gray-500"
                    >
                      Type
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold
                                   text-gray-500"
                    >
                      Premium
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold
                                   text-gray-500"
                    >
                      Risk Score
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold
                                   text-gray-500"
                    >
                      Risk Level
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-semibold
                                   text-gray-500 rounded-r-xl"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50
                                 transition"
                    >
                      <td className="px-4 py-4 text-gray-400 text-xs">
                        {i + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {p.input?.insurance_type === "health"
                              ? ""
                              : p.input?.insurance_type === "auto"
                                ? ""
                                : p.input?.insurance_type === "life"
                                  ? ""
                                  : ""}
                          </span>
                          <span className="capitalize font-medium text-gray-700">
                            {p.input?.insurance_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-[#1E3A5F]">
                        {formatINR(p.result?.predicted_premium || 0)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                            <div
                              className="h-1.5 rounded-full bg-[#2E86AB]"
                              style={{
                                width: `${p.result?.risk_score || 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {p.result?.risk_score}/100
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs
                                         font-medium
                          ${riskColor(p.result?.risk_level)}`}
                        >
                          {p.result?.risk_level}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/report/${p._id}`}
                          className="flex items-center gap-1 text-[#2E86AB]
                                     hover:underline text-xs font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" /> Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}