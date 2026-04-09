import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        getProfile()
          .then(setUser)
          .catch(() => logout())
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, []);


}

export const useAuth = () => useContext(AuthContext);