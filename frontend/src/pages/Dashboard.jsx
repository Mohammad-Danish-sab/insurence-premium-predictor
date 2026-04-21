import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getStats, getHistory } from "../services/predictService"
import { formatINR } from "../utils/formatCurrency"
import {
  BarChart2, TrendingUp, Shield, AlertTriangle,
  ArrowRight, Clock, FileText, Zap
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const statCards = [
    {
      label: "Total Predictions",
      value: stats?.total ?? 0,
      icon: <Zap className="w-5 h-5 text-secondary" />,
      bg: "bg-blue-50",
    },
    {
      label: "Avg Premium",
      value: stats ? formatINR(stats.avg_premium) : "—",
      icon: <TrendingUp className="w-5 h-5 text-success" />,
      bg: "bg-green-50",
    },
    {
      label: "Highest Premium",
      value: stats ? formatINR(stats.max_premium) : "—",
      icon: <AlertTriangle className="w-5 h-5 text-accent" />,
      bg: "bg-orange-50",
    },
    {
      label: "Avg Risk Score",
      value: stats ? `${stats.avg_risk_score} / 100` : "—",
      icon: <Shield className="w-5 h-5 text-danger" />,
      bg: "bg-red-50",
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 border-4 border-secondary border-t-transparent
                        rounded-full animate-spin"
          />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div
          className="flex flex-col sm:flex-row justify-between
                        items-start sm:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Welcome back, {user?.full_name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's your insurance prediction overview
            </p>
          </div>
          <Link
            to="/predict"
            className="bg-secondary hover:bg-primary text-white text-sm
                       font-semibold px-6 py-2.5 rounded-full transition
                       flex items-center gap-2"
          >
            New Prediction <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100
                         shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center
                              justify-center ${s.bg}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-primary mt-0.5">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 bg-white rounded-2xl border
                          border-gray-100 shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-primary">Premium Trend</h2>
              <BarChart2 className="w-5 h-5 text-gray-400" />
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(val) => formatINR(val)}
                    contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="premium"
                    stroke="#2E86AB"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#2E86AB" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="h-52 flex flex-col items-center justify-center
                              text-gray-400"
              >
                <BarChart2 className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No predictions yet</p>
                <Link
                  to="/predict"
                  className="text-secondary text-sm mt-2 hover:underline"
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
            <h2 className="font-semibold text-primary mb-6">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: <Zap className="w-4 h-4 text-secondary" />,
                  label: "New Prediction",
                  to: "/predict",
                  color: "bg-blue-50",
                },
                {
                  icon: <Clock className="w-4 h-4 text-success" />,
                  label: "View History",
                  to: "/history",
                  color: "bg-green-50",
                },
                {
                  icon: <FileText className="w-4 h-4 text-accent" />,
                  label: "Download Report",
                  to: "/history",
                  color: "bg-orange-50",
                },
              ].map((a, i) => (
                <Link
                  key={i}
                  to={a.to}
                  className="flex items-center gap-3 p-3 rounded-xl
                             hover:bg-gray-50 transition border border-gray-100"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center
                                  justify-center ${a.color}`}
                  >
                    {a.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {a.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3">Your Profile</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-secondary flex
                                items-center justify-center text-white
                                font-bold text-sm"
                >
                  {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-6 bg-white rounded-2xl border border-gray-100
                        shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-primary">Recent Predictions</h2>
            <Link
              to="/history"
              className="text-sm text-secondary hover:underline"
            >
              View all →
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No predictions yet.</p>
              <Link
                to="/predict"
                className="text-secondary text-sm mt-1 hover:underline"
              >
                Make your first prediction →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Premium</th>
                    <th className="pb-3 font-medium">Risk</th>
                    <th className="pb-3 font-medium">Risk Level</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 capitalize font-medium text-gray-700">
                        {p.input?.insurance_type || "health"}
                      </td>
                      <td className="py-3 font-semibold text-primary">
                        {formatINR(p.result?.predicted_premium || 0)}
                      </td>
                      <td className="py-3 text-gray-600">
                        {p.result?.risk_score} / 100
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium
                          ${
                            p.result?.risk_level === "Low"
                              ? "bg-green-100 text-green-700"
                              : p.result?.risk_level === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : p.result?.risk_level === "High"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.result?.risk_level}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/report/${p._id}`}
                          className="text-secondary hover:underline text-xs"
                        >
                          View Report →
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