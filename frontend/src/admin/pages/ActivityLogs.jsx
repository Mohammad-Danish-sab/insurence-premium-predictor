import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/api/activity-logs");
      setLogs(res.data.logs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Activity Logs</h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b">
                  <td className="p-4">{log.action}</td>

                  <td className="p-4">{log.user_email}</td>

                  <td className="p-4">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
