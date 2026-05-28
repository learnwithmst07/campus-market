import React, { useState, useEffect } from "react";
import API_URL from "../api";
import "./SignInForm.css";

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check-session`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setMessage("You are already logged in!");
      }
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to log in");

      setIsLoggedIn(true);
      setMessage(data.message);
      setError("");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to log out");

      setIsLoggedIn(false);
      setMessage(data.message);
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="signin-form-wrapper">
      <div className="signin-form-container">
        <h2 className="signin-form-title">Welcome Back!</h2>
        <p className="signin-form-subtitle">Sign in to your account</p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@university.edu"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
        ) : (
          <div className="logged-in-section">
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          </div>
        )}
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}