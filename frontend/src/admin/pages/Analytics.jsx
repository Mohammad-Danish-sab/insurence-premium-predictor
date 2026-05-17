import AdminLayout from "../layouts/AdminLayout";

export default function Analytics() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold mt-2">1,245</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Predictions</h2>
            <p className="text-3xl font-bold mt-2">5,320</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Revenue</h2>
            <p className="text-3xl font-bold mt-2">₹52,000</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Growth</h2>
            <p className="text-3xl font-bold mt-2">+18%</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
