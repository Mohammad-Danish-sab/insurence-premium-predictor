import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatINR } from "../utils/formatCurrency";
import api from "../services/api";
import {
  Users,
  BarChart2,
  Trash2,
  Shield,
  TrendingUp,
  Loader,
  AlertTriangle,
} from "lucide-react";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [preds, setPreds] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoad] = useState(true);
  const [deleting, setDel] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoad(true);
      try {
        const [s, u, p] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/users"),
          api.get("/api/admin/predictions"),
        ]);
        setStats(s.data);
        setUsers(u.data.users || []);
        setPreds(p.data.predictions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoad(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their predictions?")) return;
    setDel(id);
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDel(null);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats?.total_users ?? 0,
      icon: <Users className="w-5 h-5 text-secondary" />,
      bg: "bg-blue-50",
    },
    {
      label: "Total Predictions",
      value: stats?.total_predictions ?? 0,
      icon: <BarChart2 className="w-5 h-5 text-success" />,
      bg: "bg-green-50",
    },
    {
      label: "Avg Premium",
      value: stats ? formatINR(stats.avg_premium) : "—",
      icon: <TrendingUp className="w-5 h-5 text-accent" />,
      bg: "bg-orange-50",
    },
    {
      label: "Avg Risk Score",
      value: stats ? `${stats.avg_risk_score} / 100` : "—",
      icon: <AlertTriangle className="w-5 h-5 text-danger" />,
      bg: "bg-red-50",
    },
  ];

  const tabs = ["overview", "users", "predictions"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {/* ── HEADER ───────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl bg-primary flex items-center
                          justify-center"
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <p className="text-gray-500 text-sm">
              Manage users and monitor predictions
            </p>
          </div>
        </div>

        {/* ── TABS ─────────────────────────── */}
        <div
          className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl
                        border border-gray-100 shadow-sm w-fit"
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium
                          transition capitalize
                ${
                  tab === t
                    ? "bg-secondary text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ───────────────── */}
            {tab === "overview" && (
              <div className="flex flex-col gap-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <p className="text-xl font-bold text-primary mt-0.5">
                          {s.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div
                  className="bg-white rounded-2xl border border-gray-100
                                shadow-sm p-6"
                >
                  <h2 className="font-semibold text-primary mb-4">
                    Recent Predictions
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          className="text-left text-gray-400
                                       border-b border-gray-100"
                        >
                          <th className="pb-3 font-medium">User ID</th>
                          <th className="pb-3 font-medium">Type</th>
                          <th className="pb-3 font-medium">Premium</th>
                          <th className="pb-3 font-medium">Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preds.slice(0, 5).map((p, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-50
                                       hover:bg-gray-50 transition"
                          >
                            <td className="py-3 text-gray-500 font-mono text-xs">
                              {p.user_id?.slice(0, 10)}...
                            </td>
                            <td className="py-3 capitalize text-gray-700">
                              {p.input?.insurance_type}
                            </td>
                            <td className="py-3 font-bold text-primary">
                              {formatINR(p.result?.predicted_premium || 0)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full
                                               text-xs font-medium
                                ${
                                  p.result?.risk_level === "Low"
                                    ? "bg-green-100 text-green-700"
                                    : p.result?.risk_level === "Medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {p.result?.risk_level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS TAB ──────────────────── */}
            {tab === "users" && (
              <div
                className="bg-white rounded-2xl border border-gray-100
                              shadow-sm"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-semibold text-primary">
                    All Users ({users.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="text-left text-gray-400
                                     border-b border-gray-100"
                      >
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-50
                                     hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full bg-secondary
                                              flex items-center justify-center
                                              text-white text-xs font-bold"
                              >
                                {u.full_name?.charAt(0).toUpperCase()}
                              </div>
                              {u.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{u.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full
                                             text-xs font-medium capitalize
                              ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : u.role === "agent"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full
                                             text-xs font-medium
                              ${
                                u.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100   text-red-700"
                              }`}
                            >
                              {u.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={deleting === u.id || u.role === "admin"}
                              className="text-danger hover:text-red-700 transition
                                         disabled:opacity-30"
                              title={
                                u.role === "admin"
                                  ? "Cannot delete admin"
                                  : "Delete user"
                              }
                            >
                              {deleting === u.id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── PREDICTIONS TAB ────────────── */}
            {tab === "predictions" && (
              <div
                className="bg-white rounded-2xl border border-gray-100
                              shadow-sm"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-semibold text-primary">
                    All Predictions ({preds.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="text-left text-gray-400
                                     border-b border-gray-100"
                      >
                        <th className="px-6 py-4 font-medium">User ID</th>
                        <th className="px-6 py-4 font-medium">Type</th>
                        <th className="px-6 py-4 font-medium">Age/BMI</th>
                        <th className="px-6 py-4 font-medium">Smoker</th>
                        <th className="px-6 py-4 font-medium">Premium</th>
                        <th className="px-6 py-4 font-medium">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preds.map((p, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-50
                                     hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-gray-400">
                            {p.user_id?.slice(0, 10)}...
                          </td>
                          <td className="px-6 py-4 capitalize text-gray-700">
                            {p.input?.insurance_type}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {p.input?.age}y / {p.input?.bmi}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full
                                             text-xs font-medium
                              ${
                                p.input?.smoker
                                  ? "bg-red-100   text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {p.input?.smoker ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">
                            {formatINR(p.result?.predicted_premium || 0)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full
                                             text-xs font-medium
                              ${
                                p.result?.risk_level === "Low"
                                  ? "bg-green-100  text-green-700"
                                  : p.result?.risk_level === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100    text-red-700"
                              }`}
                            >
                              {p.result?.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
