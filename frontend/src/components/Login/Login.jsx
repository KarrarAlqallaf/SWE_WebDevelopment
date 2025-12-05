import { useState } from "react";
import "./Login.css";

const API_BASE_URL = `http://localhost:8000`;

export default function Login({ onBack, onLogin, onOpenSignUp, onOpenAdminLogin }) {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
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
        setError(data.message || "Login failed");
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

        <h1 className="title">Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">👤</span>
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              disabled={loading}
            />
            <span className="icon">🔒</span>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            <span className="btn-text">{loading ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        <div className="meta">
          <div className="hint">
            If you do not have account <button type="button" className="link-btn" onClick={onOpenSignUp}>Sign Up</button>
          </div>
          <div className="hint">
            Admin? <button type="button" className="link-btn" onClick={onOpenAdminLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}