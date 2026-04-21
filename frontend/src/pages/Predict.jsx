import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { predictPremium, predictGuest } from "../services/predictService";
import { validatePredictForm } from "../utils/validateForm";
import { formatINR } from "../utils/formatCurrency";
import {
  Loader,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
