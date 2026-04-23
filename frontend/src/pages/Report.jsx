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
} from "lucide-react";


const riskColor = (level) =>
  ({
    Low: "text-green-600 bg-green-50  border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    High: "text-orange-600 bg-orange-50 border-orange-200",
    "Very High": "text-red-600    bg-red-50    border-red-200",
  })[level] || "";

export default function Report() {
  const { id }              = useParams()
  const [data,    setData]  = useState(null)
  const [loading, setLoad]  = useState(true)
  const [error,   setError] = useState("")

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/history/${id}`)
        setData(res.data)
      } catch {
        setError("Prediction not found.")
      } finally {
        setLoad(false)
      }
    }
    fetch()
  }, [id])

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

   if (error)
     return (
       <div className="min-h-screen flex flex-col">
         <Navbar />
         <div className="flex-1 flex flex-col items-center justify-center gap-4">
           <p className="text-gray-500">{error}</p>
           <Link
             to="/history"
             className="text-secondary hover:underline text-sm"
           >
             ← Back to History
           </Link>
         </div>
       </div>
     );

   const { input, result } = data;

}