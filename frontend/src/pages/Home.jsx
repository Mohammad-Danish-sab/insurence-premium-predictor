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

      {/* ── HERO ───────────────────────────── */}
      <section className="bg-gradient-to-br from-primary via-blue-800 to-secondary
                          text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5
                          rounded-full text-sm mb-6 backdrop-blur">
            <Shield className="w-4 h-4" />
            Smart Insurance Premium Calculator
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Know Your Insurance
            <span className="text-accent block">Premium Instantly</span>
          </h1>

          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
            Get accurate premium predictions for Health, Life, Auto & Home insurance.
            Understand your risk score, compare plans, and download professional reports.
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
