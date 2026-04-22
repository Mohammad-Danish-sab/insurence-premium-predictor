import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getHistory,
  deletePrediction,
  downloadReport,
} from "../services/predictService";
import { formatINR } from "../utils/formatCurrency";
import {
  Clock,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader,
} from "lucide-react";

const riskBadge = (level) => ({
  "Low":       "bg-green-100  text-green-700",
  "Medium":    "bg-yellow-100 text-yellow-700",
  "High":      "bg-orange-100 text-orange-700",
  "Very High": "bg-red-100    text-red-700",
}[level] || "bg-gray-100 text-gray-700")

export default function History() {
  const [predictions, setPredictions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [search,      setSearch]      = useState("")
  const [filter,      setFilter]      = useState("all")
  const [deleting,    setDeleting]    = useState(null)


    const fetchHistory = async (p = 1) => {
      setLoading(true);
      try {
        const res = await getHistory(p);
        setPredictions(res.predictions || []);
        setTotalPages(res.pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchHistory(page);
    }, [page]);
   
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this prediction?")) return;
      setDeleting(id);
      try {
        await deletePrediction(id);
        setPredictions(predictions.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setDeleting(null);
      }
    };

    const filtered = predictions.filter((p) => {
      const matchFilter =
        filter === "all" || p.input?.insurance_type === filter;
      const matchSearch =
        search === "" ||
        p.input?.insurance_type?.includes(search.toLowerCase()) ||
        p.result?.risk_level?.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
}