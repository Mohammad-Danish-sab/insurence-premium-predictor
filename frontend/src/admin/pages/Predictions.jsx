import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await API.get("/admin/predictions");
      setPredictions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Predictions</h1>

        <div className="bg-white rounded-2xl shadow overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Insurance</th>
                <th className="p-4">Premium</th>
                <th className="p-4">Risk</th>
              </tr>
            </thead>

            <tbody>
              {predictions.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-4">{p.user_name}</td>

                  <td className="p-4">{p.insurance_type}</td>

                  <td className="p-4">₹{p.predicted_premium}</td>

                  <td className="p-4">{p.risk_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
