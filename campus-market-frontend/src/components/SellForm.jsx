import React, { useState, useEffect } from "react";
import "./SellForm.css";

export default function SellForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    mobileNumber: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check-session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser({ id: data.userId });
        } else {
          window.location.href = "/signin"; // Redirect to signin if not logged in
        }
      } catch (err) {
        window.location.href = "/signin";
      }
    };
    checkSession();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("condition", formData.condition);
    formDataToSend.append("mobileNumber", formData.mobileNumber);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create listing");

      setMessage("Listing created successfully!");
      alert("created successfully!");
      setError("");
      setFormData({
        productName: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        mobileNumber: "",
        image: null,
      });
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="sell-form-wrapper">
      <div className="sell-form-container">
        <h2 className="sell-form-title">Sell an Item</h2>
        <p className="sell-form-subtitle">Fill in the details to list your item</p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="sell-form">
          <div className="form-group">
            <label htmlFor="productName" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g., Calculus Textbook"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item (condition, features, etc.)"
              className="form-textarea"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 500"
              className="form-input"
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a category</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="condition" className="form-label">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
              <option value="Worn">Worn</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="e.g., 9123456789"
              className="form-input"
              required
              pattern="[0-9]{10}"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
              />
            )}
          </div>
          <button type="submit" className="submit-button">
            List Item
          </button>
        </form>
      </div>
    </div>
  );
}