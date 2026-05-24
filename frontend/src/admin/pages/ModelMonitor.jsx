import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import API from "../services/adminService";

import { Activity, Users, Brain, BarChart3 } from "lucide-react";

export default function ModelMonitor() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/model-monitor");

      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-xl font-semibold">
          Loading monitoring data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E3A5F]">
            Model Monitoring
          </h1>

          <p className="text-gray-500 mt-2">
            Real-time AI prediction analytics dashboard
          </p>
        </div>

        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Predictions */}
            <div className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Predictions</p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stats.total_predictions}
                  </h2>
                </div>

                <div className="bg-blue-100 p-4 rounded-2xl">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Model Accuracy</p>

                  <h2 className="text-4xl font-bold mt-2">{stats.accuracy}%</h2>
                </div>

                <div className="bg-green-100 p-4 rounded-2xl">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Active Users</p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stats.active_users}
                  </h2>
                </div>

                <div className="bg-purple-100 p-4 rounded-2xl">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">System Health</p>

                  <h2 className="text-4xl font-bold mt-2">Stable</h2>
                </div>

                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
