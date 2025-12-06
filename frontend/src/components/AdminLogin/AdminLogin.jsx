import { useState } from "react";
import "./AdminLogin.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export default function AdminLogin({ onBack, onLogin, onOpenUserLogin }) {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admin),
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem("token", data.data.token);
        // Call parent callback with user data
        if (onLogin) {
          onLogin(data.data.user, data.data.token);
        }
      } else {
        setError(data.message || "Admin login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <button type="button" className="back-btn" onClick={onBack}>←</button>

        <h1 className="title">Admin Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="text"
              placeholder="Username"
              value={admin.username}
              onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">👤</span>
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Password"
              value={admin.password}
              onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">🔒</span>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            <span className="btn-text">{loading ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        <div className="meta">
          <div className="hint">Not an admin?</div>
          <button type="button" className="link-btn" onClick={onOpenUserLogin}>User Login</button>
        </div>
      </div>
    </div>
  );
}