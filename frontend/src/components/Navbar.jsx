import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  History,
  LogOut,
  ShieldCheck,
  User,
  ChevronDown,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-[#2E86AB] font-semibold border-b-2 border-[#2E86AB] pb-0.5"
      : "text-white hover:text-[#2E86AB] transition";

  // Desktop + Mobile Navigation Links
  const navLinks = user
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/predict", label: "Get Quote" },
        { to: "/history", label: "History" },

        // NEW LINKS
        { to: "/family-floater", label: "Family Floater" },
        { to: "/city-comparison", label: "City Compare" },

        { to: "/contact", label: "Contact" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/faq", label: "FAQ" },
        { to: "/contact", label: "Contact" },
      ];

  const dropdownItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: "My Profile",
      to: "/profile",
      desc: "Edit your info & photo",
    },
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Dashboard",
      to: "/dashboard",
      desc: "View your overview",
    },
    {
      icon: <History className="w-4 h-4" />,
      label: "History",
      to: "/history",
      desc: "Past predictions",
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: "FAQ",
      to: "/faq",
      desc: "Common questions",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Contact Us",
      to: "/contact",
      desc: "Get support",
    },
    ...(user?.role === "admin"
      ? [
          {
            icon: <ShieldCheck className="w-4 h-4" />,
            label: "Admin Panel",
            to: "/admin",
            desc: "Manage users",
          },
        ]
      : []),
  ];

  return (
    <nav className="bg-slate-700 shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Shield className="text-red-500 w-6 h-6" />
            </div>

            <span className="text-xl font-bold text-white">
              Insure<span className="text-red-500">Predict</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link, i) => (
              <Link key={i} to={link.to} className={isActive(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition border border-gray-200"
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-lg bg-linear-to-br
                               from-[#1E3A5F] to-[#2E86AB]
                               flex items-center justify-center
                               text-white font-bold text-sm overflow-hidden"
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.full_name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-none">
                      {user.full_name?.split(" ")[0]}
                    </p>

                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                      {user.role}
                    </p>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      dropOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropOpen(false)}
                    />

                    <div
                      className="absolute right-0 mt-2 w-64 bg-white
                                 rounded-2xl shadow-xl border
                                 border-gray-100 z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div
                        className="px-4 py-4 bg-linear-to-r
                                   from-[#1E3A5F] to-[#277496]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl bg-white/20
                                       flex items-center justify-center
                                       text-white font-bold text-sm overflow-hidden"
                          >
                            {user?.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.full_name?.charAt(0).toUpperCase()
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-white">
                              {user.full_name}
                            </p>

                            <p className="text-xs text-blue-200">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-2">
                        {dropdownItems.map((item, i) => (
                          <Link
                            key={i}
                            to={item.to}
                            onClick={() => setDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group"
                          >
                            <div
                              className="w-8 h-8 rounded-lg bg-gray-100
                                         group-hover:bg-[#2E86AB]/10
                                         flex items-center justify-center
                                         text-gray-400
                                         group-hover:text-[#2E86AB]
                                         transition"
                            >
                              {item.icon}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {item.label}
                              </p>

                              <p className="text-xs text-gray-400">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3
                                     text-red-500 hover:bg-red-50
                                     transition w-full text-left rounded-xl"
                        >
                          <div
                            className="w-8 h-8 rounded-lg bg-red-50
                                       flex items-center justify-center"
                          >
                            <LogOut className="w-4 h-4" />
                          </div>

                          <div>
                            <p className="text-sm font-medium">Logout</p>

                            <p className="text-xs text-gray-400">
                              Sign out of account
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white hover:text-[#2E86AB] transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-linear-to-r from-[#2E86AB] to-[#1E3A5F]
                             text-white text-sm font-semibold px-5 py-2.5
                             rounded-xl hover:opacity-90 transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
          {/* Mobile User */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              <div
                className="w-10 h-10 rounded-xl bg-linear-to-br
                           from-[#1E3A5F] to-[#2E86AB]
                           flex items-center justify-center
                           text-white font-bold text-sm"
              >
                {user.full_name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user.full_name}
                </p>

                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${
                  location.pathname === link.to
                    ? "bg-[#2E86AB]/10 text-[#2E86AB]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Extra */}
          {user && (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                           text-sm font-medium text-gray-700
                           hover:bg-gray-50 transition"
              >
                <User className="w-4 h-4 text-[#2E86AB]" />
                My Profile
              </Link>

              <Link
                to="/faq"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                           text-sm font-medium text-gray-700
                           hover:bg-gray-50 transition"
              >
                <HelpCircle className="w-4 h-4 text-[#2E86AB]" />
                FAQ
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                             text-sm font-medium text-gray-700
                             hover:bg-gray-50 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                             text-sm font-medium text-red-500
                             hover:bg-red-50 transition w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Guest Mobile */}
          {!user && (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-center text-sm font-medium
                           text-gray-700 hover:bg-gray-50 rounded-xl transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-[#2E86AB] text-white px-4 py-2.5
                           rounded-xl text-center text-sm font-semibold"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
