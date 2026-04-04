import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 320, margin: "100px auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: "100%", marginBottom: 12 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: "100%", marginBottom: 12 }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Login
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
