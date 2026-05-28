import React, { useState } from "react";
import API_URL from "../api";
import "./SignUpForm.css";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    email: "",
    password: "",
    class: "",
    branch: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to sign up");

      setMessage(data.message);
      setError("");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h2 className="signup-form-title">Join CampusMarket</h2>
        <p className="signup-form-subtitle">Create your student account</p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp} className="signup-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="university" className="form-label">
              University
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="e.g., University of California"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="class" className="form-label">
              Class
            </label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              placeholder="e.g., FY, SY, TY, BE or 1st Year"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="branch" className="form-label">
              Branch
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g., Computer Engineering"
              className="form-input"
              required
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <p className="signin-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
}