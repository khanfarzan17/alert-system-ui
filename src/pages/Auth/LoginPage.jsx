import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/Authcontext";
import { loginRequest } from "../../Services/authService";
import "../../styles/loginPage/loginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginRequest(email, password);
      console.log("Login API response:", response);
      login(response, email);
      setError("");
      navigate("/upload");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              placeholder="you@example.com"
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

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
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
