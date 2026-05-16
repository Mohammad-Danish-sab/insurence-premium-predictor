import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  MessageSquare,
  Activity,
  BarChart3,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },

    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },

    {
      name: "Predictions",
      icon: <ClipboardList size={20} />,
      path: "/admin/predictions",
    },

    {
      name: "Blogs",
      icon: <FileText size={20} />,
      path: "/admin/blogs",
    },

    {
      name: "Contacts",
      icon: <MessageSquare size={20} />,
      path: "/admin/contacts",
    },

    {
      name: "Activity Logs",
      icon: <Activity size={20} />,
      path: "/admin/activity-logs",
    },

    {
      name: "Model Monitor",
      icon: <BarChart3 size={20} />,
      path: "/admin/model-monitor",
    },
  ];

  return (
    <div className="w-64 bg-black text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            {item.icon}

            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={logout}
        className="mt-10 flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 w-full"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;
