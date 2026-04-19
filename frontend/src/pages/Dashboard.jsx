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
}