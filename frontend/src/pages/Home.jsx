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

