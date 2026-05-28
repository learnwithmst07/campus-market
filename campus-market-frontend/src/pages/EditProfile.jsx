import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import "./EditProfile.css";

function EditProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    class: "",
    branch: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check-auth", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile. Please log in.");
        }
        const data = await response.json();
        if (!data.isAuthenticated) {
          throw new Error("Please log in to edit your profile.");
        }
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          university: data.user.university || "",
          class: data.user.class || "",
          branch: data.user.branch || "",
        });
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="edit-profile-error">
        {error}
        {error.includes("log in") && (
          <Link to="/signin" className="login-link">
            Log In
          </Link>
        )}
      </div>
    );
  }

  if (!user) {
    return <div className="edit-profile-loading">Loading...</div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h1 className="edit-profile-title">Edit Profile</h1>

        <div className="edit-profile-form-section">
          <div className="form-header">
            <User className="form-icon" size={32} />
            <h2 className="form-title">Update Your Information</h2>
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="university">University</label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="class">Class</label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="signup-button nav-button mt-logout">
                Save Changes
              </button>
              <Link to="/dashboard" className="nav-button cart-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;