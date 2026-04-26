import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-secondary" />
              <span className="text-xl font-bold text-white">
                Insure<span className="text-secondary text-red-500">Predict</span>
              </span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed max-w-sm">
              Get accurate insurance premium predictions instantly. Compare
              plans, understand your risk, and make smarter insurance decisions.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-800">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />{" "}
                support@insurepredict.com
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" /> +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" /> New Delhi, India
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-red-500 mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-800">
              <li>
                <Link to="/" className="hover:text-secondary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-secondary transition">
                  Get Quote
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-secondary transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-secondary transition">
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-red-500">Insurance Types</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>🏥 Health Insurance</li>
              <li>🚗 Auto Insurance</li>
              <li>🏠 Home Insurance</li>
              <li>💼 Life Insurance</li>
            </ul>
          </div>

          <div
            className="border-t border-blue-800 mt-10 pt-6 flex flex-col
                        md:flex-row justify-between items-center gap-4"
          >
            <p className="text-sm text-gray-700">
              © {new Date().getFullYear()} InsurePredict. All rights reserved.
            </p>
            <p className="text-xs text-gray-800">
              This tool is for estimation purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}