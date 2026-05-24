import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import API from "../services/adminService";

import { Users, FileText, BookOpen, Mail } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/analytics");

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-[#1E3A5F] mb-8">Analytics</h1>

        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow">
              <Users className="w-10 h-10 mb-4 text-blue-500" />

              <h2 className="text-gray-500">Users</h2>

              <p className="text-4xl font-bold">{stats.total_users}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow">
              <FileText className="w-10 h-10 mb-4 text-green-500" />

              <h2 className="text-gray-500">Predictions</h2>

              <p className="text-4xl font-bold">{stats.total_predictions}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow">
              <BookOpen className="w-10 h-10 mb-4 text-orange-500" />

              <h2 className="text-gray-500">Blogs</h2>

              <p className="text-4xl font-bold">{stats.total_blogs}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow">
              <Mail className="w-10 h-10 mb-4 text-purple-500" />

              <h2 className="text-gray-500">Contacts</h2>

              <p className="text-4xl font-bold">{stats.total_contacts}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
