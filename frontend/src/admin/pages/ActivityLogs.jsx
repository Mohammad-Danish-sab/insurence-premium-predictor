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
      const res = await API.get("/admin/logs");
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

        <div className="bg-white rounded-2xl shadow overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="p-4">{log.user}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
