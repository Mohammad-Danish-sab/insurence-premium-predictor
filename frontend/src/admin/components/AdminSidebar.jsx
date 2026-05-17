import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Activity,
  Shield,
  Mail,
  BookOpen,
  Cpu,
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin/dashboard",
    },

    {
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/users",
    },

    {
      name: "Predictions",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/predictions",
    },

    {
      name: "Analytics",
      icon: <BarChart2 className="w-5 h-5" />,
      path: "/admin/analytics",
    },

    {
      name: "Activity Logs",
      icon: <Activity className="w-5 h-5" />,
      path: "/admin/activity-logs",
    },

    {
      name: "Contacts",
      icon: <Mail className="w-5 h-5" />,
      path: "/admin/contacts",
    },

    {
      name: "Blogs",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/admin/blogs",
    },

    {
      name: "Model Monitor",
      icon: <Cpu className="w-5 h-5" />,
      path: "/admin/model-monitor",
    },
  ];

  return (
    <div
      className="
      w-72
      min-h-screen
      bg-gradient-to-b
      from-[#1E3A5F]
      via-[#2E86AB]
      to-[#1E3A5F]
      text-white
      p-6
      shadow-2xl
    "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="
          w-12 h-12 rounded-2xl
          bg-white/10
          flex items-center justify-center
          backdrop-blur
        "
        >
          <Shield className="w-7 h-7 text-[#F4A261]" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Admin<span className="text-[#F4A261]">Panel</span>
          </h1>

          <p className="text-sm text-blue-100">Insurance Dashboard</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {menus.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={i}
              to={item.path}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-2xl
                transition-all duration-200
                group
                ${
                  active
                    ? "bg-white text-[#1E3A5F] shadow-lg"
                    : "hover:bg-white/10 text-white"
                }
              `}
            >
              <div
                className={`
                  transition
                  ${active ? "scale-110" : "group-hover:scale-105"}
                `}
              >
                {item.icon}
              </div>

              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
