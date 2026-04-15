import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/authService";
import { validateLogin } from "../utils/validateForm";
import { Shield, Eye, EyeOff, Loader } from "lucide-react";
