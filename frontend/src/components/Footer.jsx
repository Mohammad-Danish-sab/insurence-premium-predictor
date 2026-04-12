import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-secondary" />
              <span className="text-xl font-bold">
                Insure<span className="text-secondary">Predict</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Get accurate insurance premium predictions instantly. Compare
              plans, understand your risk, and make smarter insurance decisions.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> support@insurepredict.com
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> New Delhi, India
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-300">
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

          
        </div>
      </div>
    </footer>
  );
}