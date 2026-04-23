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

      return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">

        <div className="flex flex-col sm:flex-row justify-between
                        items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Prediction History
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              All your past insurance premium predictions
            </p>
          </div>
          <Link
            to="/predict"
            className="bg-secondary hover:bg-primary text-white text-sm
                       font-semibold px-6 py-2.5 rounded-full transition"
          >
            + New Prediction
          </Link>
        </div>

         <div className="bg-white rounded-2xl border border-gray-100
                        shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by type or risk level..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200
                         text-sm outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {["all", "health", "life", "auto", "home"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium
                            transition capitalize
                  ${filter === f
                    ? "bg-secondary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {f}
              </button>
            ))}
        </div>
        </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No predictions found</p>
              <p className="text-sm mt-1">
                {search || filter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Make your first prediction to see it here"
                }
              </p>
              <Link
                to="/predict"
                className="inline-block mt-4 text-secondary text-sm hover:underline"
              >
                Get a quote →
              </Link>
            </div>
          ) : (
            <>
             <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="px-6 py-4 font-medium">#</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Age / BMI</th>
                      <th className="px-6 py-4 font-medium">Smoker</th>
                      <th className="px-6 py-4 font-medium">Premium</th>
                      <th className="px-6 py-4 font-medium">Risk</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr
                        key={p._id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-400">
                          {(page - 1) * 10 + i + 1}
                        </td>
                        <td className="px-6 py-4 capitalize font-medium text-gray-700">
                          {p.input?.insurance_type}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {p.input?.age}y / {p.input?.bmi}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${p.input?.smoker
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"}`}>
                            {p.input?.smoker ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">
                          {formatINR(p.result?.predicted_premium || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                          ${riskBadge(p.result?.risk_level)}`}>
                            {p.result?.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => downloadReport(p._id)}
                              className="text-secondary hover:text-primary transition"
                              title="Download Report"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              disabled={deleting === p._id}
                              className="text-danger hover:text-red-700 transition
                                         disabled:opacity-40"
                              title="Delete"
                            >
                              {deleting === p._id
                                ? <Loader className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
         <div className="md:hidden flex flex-col divide-y divide-gray-100">
                {filtered.map((p) => (
                  <div key={p._id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="capitalize font-semibold text-primary">
                        {p.input?.insurance_type} Insurance
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                      ${riskBadge(p.result?.risk_level)}`}>
                        {p.result?.risk_level}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-secondary mb-2">
                      {formatINR(p.result?.predicted_premium || 0)}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                      <span>Age: {p.input?.age}</span>
                      <span>BMI: {p.input?.bmi}</span>
                      <span>Smoker: {p.input?.smoker ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => downloadReport(p._id)}
                        className="flex items-center gap-1.5 text-xs text-secondary
                                   font-medium hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" /> Report
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        className="flex items-center gap-1.5 text-xs text-danger
                                   font-medium hover:underline disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </> 
          )}
        </div>
      </main>
    </div>
  ) 
}