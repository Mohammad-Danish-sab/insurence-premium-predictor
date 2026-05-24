import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import InsuranceScore from "./pages/InsuranceScore";
import CityComparison from "./pages/CityComparison";
import FamilyFloater from "./pages/FamilyFloater";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Predictions from "./admin/pages/Predictions";
import Blogs from "./admin/pages/Blogs";
import Contacts from "./admin/pages/Contacts";
import ActivityLogs from "./admin/pages/ActivityLogs";
import ModelMonitor from "./admin/pages/ModelMonitor";
import AdminSignup from "./admin/pages/AdminSignup";
import Analytics from "./admin/pages/Analytics";
import CreateBlog from "./admin/pages/CreateBlog";
import EditBlog from "./admin/pages/EditBlog";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/faq" element={<FAQ />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/insurance-score" element={<InsuranceScore />} />

          <Route path="/city-comparison" element={<CityComparison />} />

          <Route path="/family-floater" element={<FamilyFloater />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/predict"
            element={
              <ProtectedRoute>
                <Predict />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <Users />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/predictions"
            element={
              <AdminProtectedRoute>
                <Predictions />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <AdminProtectedRoute>
                <Blogs />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/contacts"
            element={
              <AdminProtectedRoute>
                <Contacts />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/activity-logs"
            element={
              <AdminProtectedRoute>
                <ActivityLogs />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/model-monitor"
            element={
              <AdminProtectedRoute>
                <ModelMonitor />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <Analytics />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs/create"
            element={
              <AdminProtectedRoute>
                <CreateBlog />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs/edit/:id"
            element={
              <AdminProtectedRoute>
                <EditBlog />
              </AdminProtectedRoute>
            }
          />

          <Route path="/admin/signup" element={<AdminSignup />} />

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-3xl font-bold text-gray-500">
                404 — Page Not Found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
