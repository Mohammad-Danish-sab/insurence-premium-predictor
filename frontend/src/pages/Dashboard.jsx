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
  const { user }                    = useAuth()
  const [stats,    setStats]        = useState(null)
  const [history,  setHistory]      = useState([])
  const [loading,  setLoading]      = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, h] = await Promise.all([getStats(), getHistory(1)])
        setStats(s)
        setHistory(h.predictions || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

        {/* ── WELCOME ──────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between
                        items-start sm:items-center mb-10 gap-4">
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
        </main>
      </div>
      )
      }
