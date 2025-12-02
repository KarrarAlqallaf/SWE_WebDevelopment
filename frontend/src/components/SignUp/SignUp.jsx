import { useState } from "react";
import "./SignUp.css";

const API_BASE_URL = `http://localhost:8000`;

export default function SignUp({ onBack, onSignUp, onOpenLogin, onOpenAdminLogin }) {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem("token", data.data.token);
        // Call parent callback with user data
        if (onSignUp) {
          onSignUp(data.data.user, data.data.token);
        }
      } else {
        setError(data.message || "Signup failed");
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
        <button className="back-btn" onClick={onBack} type="button">
          <span>←</span>
        </button>

        <h1 className="title">Sign Up</h1>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">✉️</span>
          </div>

          <div className="field">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">👤</span>
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">🔒</span>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            <span className="btn-text">{loading ? "Signing up..." : "Sign Up"}</span>
          </button>
        </form>

        <div className="meta">
          <div className="hint">
            Already have an account? <button type="button" className="link-btn" onClick={onOpenLogin}>Login</button>
          </div>
          <div className="hint">
            Admin? <button type="button" className="link-btn" onClick={onOpenAdminLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}