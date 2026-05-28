import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, User, CheckCircle, RefreshCw } from "lucide-react";
import API_URL from "../api";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user profile and listings on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        // Fetch user profile
        const userResponse = await fetch(`${API_URL}/api/auth/check-auth`, {
          credentials: "include",
        });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile. Please log in.");
        }
        const userData = await userResponse.json();
        if (!userData.isAuthenticated) {
          throw new Error("Please log in to access your dashboard.");
        }
        setUser(userData.user);

        // Fetch user's listings
        const listingsResponse = await fetch(`${API_URL}/api/listings/my-listings`, {
          credentials: "include",
        });
        if (!listingsResponse.ok) {
          const errorText = await listingsResponse.text();
          throw new Error(`Failed to fetch listings: ${listingsResponse.status} - ${errorText}`);
        }
        const listingsData = await listingsResponse.json();
        setListings(listingsData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(`${API_URL}/api/listings/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete listing: ${response.status} - ${errorText}`);
      }
      setListings(listings.filter((listing) => listing._id !== listingId));
      setSuccessMessage("Listing deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Delete listing error:", err);
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleMarkSold = async (listingId, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/listings/${listingId}/sold`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update listing: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setListings(listings.map((l) =>
        l._id === listingId ? { ...l, isSold: data.listing.isSold } : l
      ));
      setSuccessMessage(`Listing marked as ${data.listing.isSold ? "Sold" : "Available"}!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Mark sold error:", err);
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  if (error) {
    return (
      <div className="dashboard-error">
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
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Dashboard</h1>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <User className="profile-icon" size={32} />
            <h2 className="profile-title">Profile</h2>
          </div>
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {user.fullName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p>
              <strong>University:</strong> {user.university || "N/A"}
            </p>
            <p>
              <strong>Class:</strong> {user.class || "N/A"}
            </p>
            <p>
              <strong>Branch:</strong> {user.branch || "N/A"}
            </p>
          </div>
          <Link to="/profile/edit" className="signup-button nav-button mt-edit">
            Edit Profile
          </Link>
        </div>

        {/* Listings Section */}
        <div className="listings-section">
          <h2 className="listings-title">Your Listings</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {listings.length === 0 ? (
            <div className="no-listings">
              <p>You haven't listed any items yet.</p>
              <Link to="/sell" className="signup-button nav-button mt-edit-sell">
                Sell an Item
              </Link>
            </div>
          ) : (
            <div className="listings-table-wrapper">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing._id}>
                      <td>
                        <Link to={`/item/${listing._id}`} className="product-link">
                          {listing.productName || "Untitled"}
                        </Link>
                      </td>
                      <td>{listing.category || "Uncategorized"}</td>
                      <td>₹{listing.price || "0"}</td>
                      <td>{listing.condition || "Unknown"}</td>
                      <td>
                        <span className={listing.isSold ? "badge-sold" : "badge-available"}>
                          {listing.isSold ? "Sold" : "Available"}
                        </span>
                      </td>
                      <td>
                        {new Date(listing.createdAt).toLocaleDateString() || "N/A"}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleMarkSold(listing._id, listing.isSold)}
                          className={listing.isSold ? "sold-toggle-button unsold" : "sold-toggle-button"}
                          aria-label={`Mark ${listing.productName} as ${listing.isSold ? "available" : "sold"}`}
                          title={listing.isSold ? "Mark as Available" : "Mark as Sold"}
                        >
                          {listing.isSold ? <RefreshCw size={15} /> : <CheckCircle size={15} />}
                          {listing.isSold ? "Unmark" : "Sold"}
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="delete-button"
                          aria-label={`Delete ${listing.productName}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;