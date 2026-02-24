import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setIsValid(false);
      setLoading(false);
      return;
    }

    try {
      // Decode JWT (basic validation)
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Check expiration
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("admin_token");
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } catch (err) {
      localStorage.removeItem("admin_token");
      setIsValid(false);
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return isValid ? children : <Navigate to="/admin/login" replace />;
}