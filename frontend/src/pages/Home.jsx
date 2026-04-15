import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Shield,
  Zap,
  FileText,
  BarChart2,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-secondary" />,
    title: "Instant Prediction",
    desc: "Get your insurance premium calculated in seconds using smart rule-based engine.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-secondary" />,
    title: "Risk Analysis",
    desc: "Understand your personal risk score and what factors are driving your premium.",
  },
  {
    icon: <FileText className="w-6 h-6 text-secondary" />,
    title: "PDF Report",
    desc: "Download a professional insurance report with full breakdown and recommendations.",
  },
  {
    icon: <Shield className="w-6 h-6 text-secondary" />,
    title: "Plan Comparison",
    desc: "Compare Basic, Standard, and Premium plans side by side to find the best fit.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    desc: "Sign up for free in under a minute.",
  },
  {
    step: "02",
    title: "Enter Details",
    desc: "Fill in your age, BMI, lifestyle details.",
  },
  {
    step: "03",
    title: "Get Your Quote",
    desc: "Receive instant premium with risk analysis.",
  },
  {
    step: "04",
    title: "Download Report",
    desc: "Save your PDF report and compare plans.",
  },
];

const stats = [
  { value: "10,000+", label: "Quotes Generated" },
  { value: "4 Types", label: "Insurance Coverage" },
  { value: "99.9%", label: "Uptime" },
  { value: "Free", label: "Always" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    review:
      "InsurePredict helped me understand why my premium was high. I quit smoking and saved ₹8,000/year!",
    stars: 5,
  },
  {
    name: "Rahul Verma",
    role: "Business Owner",
    review:
      "The plan comparison feature is amazing. I found the perfect policy for my family in minutes.",
    stars: 5,
  },
  {
    name: "Anjali Singh",
    role: "Doctor",
    review:
      "Very professional PDF report. I shared it directly with my insurance agent.",
    stars: 4,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section
        className="bg-gradient-to-br from-primary via-blue-800 to-secondary
                          text-white py-24 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5
                          rounded-full text-sm mb-6 backdrop-blur"
          >
            <Shield className="w-4 h-4" />
            Smart Insurance Premium Calculator
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Know Your Insurance
            <span className="text-accent block">Premium Instantly</span>
          </h1>

          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
            Get accurate premium predictions for Health, Life, Auto & Home
            insurance. Understand your risk score, compare plans, and download
            professional reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-accent hover:bg-orange-500 text-white font-semibold
                         px-8 py-3 rounded-full transition flex items-center
                         justify-center gap-2"
            >
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/predict"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold
                         px-8 py-3 rounded-full transition backdrop-blur"
            >
              Try as Guest
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary">
              Everything You Need
            </h2>
            <p className="text-gray-500 mt-3">
              Powerful features to help you make smarter insurance decisions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                           hover:shadow-md hover:-translate-y-1 transition"
              >
                <div
                  className="w-12 h-12 bg-blue-50 rounded-xl flex items-center
                                justify-center mb-4"
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary">How It Works</h2>
            <p className="text-gray-500 mt-3">
              Get your quote in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div
                  className="w-14 h-14 bg-secondary text-white rounded-full
                                flex items-center justify-center text-xl font-bold
                                mx-auto mb-4"
                >
                  {s.step}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-7 left-[60%]
                                  w-full h-0.5 bg-gray-200"
                  />
                )}
                <h3 className="font-semibold text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}

