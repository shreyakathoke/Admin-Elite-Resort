import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/adminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Demo credentials
    const ADMIN_EMAIL = "admin@eliteresort.com";
    const ADMIN_PASSWORD = "admin123";

    if (
      form.email === ADMIN_EMAIL &&
      form.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2 className="login-title">Elite Resort Admin</h2>
        <p className="login-subtitle">
          Sign in to access the admin dashboard
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="admin@eliteresort.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}