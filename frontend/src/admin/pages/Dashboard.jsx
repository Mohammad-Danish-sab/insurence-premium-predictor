import AdminSidebar from "../components/AdminSidebar";
import AnalyticsCards from "../components/AnalyticsCards";
import UserManagementTable from "../components/UserManagementTable";

export default function Dashboard() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E3A5F]">Admin Dashboard</h1>

          <p className="text-gray-500 mt-2">
            Monitor platform performance and users
          </p>
        </div>

        <AnalyticsCards />

        <div className="mt-8">
          <UserManagementTable />
        </div>
      </div>
    </div>
  );
}
