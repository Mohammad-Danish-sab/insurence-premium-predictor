import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function ModelMonitor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/model-monitor");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Model Monitoring</h1>

        {stats && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2>Total Predictions</h2>
              <p className="text-3xl font-bold">{stats.total_predictions}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2>Accuracy</h2>
              <p className="text-3xl font-bold">{stats.accuracy}%</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2>Active Users</h2>
              <p className="text-3xl font-bold">{stats.active_users}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
