import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/loginPage/loginPage.css";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy credentials
    if (email === "admin@example.com" && password === "admin123") {
      setError("");
      navigate("/upload");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div id="screen-login">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-mark">⚡</div>
          <div className="login-brand">
            Alert<span>System</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="login-title">Admin Login</h2>
        <p className="login-sub">Enter your credentials to continue</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          {error && <div className="error-text">{error}</div>}
        </form>

        {/* Footer */}
        <div className="login-footer">© 2026 Alert System</div>
      </div>
    </div>
  );
};

export default LoginPage;
