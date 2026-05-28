

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import API_URL from "../api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cart`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch cart");
        setCartItems(data);
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError(err.message);
        if (err.message.includes("Please log in")) {
          setTimeout(() => navigate("/signin"), 2000);
        }
      }
    };

    fetchCart();
  }, [navigate]);

  const handleRemoveFromCart = async (listingId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/remove/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to remove item");

      setMessage("Item removed successfully!");
      // Refresh cart after removal
      const updatedCart = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      setCartItems(updatedCart);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Remove from cart error:", err);
      setMessage(err.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.listingId.price) || 0;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  if (error && !error.includes("Please log in")) {
    return <div className="cart-error">{error}</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">
          <ShoppingCart size={24} className="cart-icon" />
          Your Cart
        </h1>
        {error.includes("Please log in") && (
          <p className="cart-message error">Please log in to view your cart. Redirecting...</p>
        )}
        {message && (
          <p className={`cart-message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </p>
        )}
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/browse" className="browse-link">
              Browse Items
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <Link to={`/item/${item.listingId._id}`} className="cart-item-link">
                    <img
                      src={item.listingId.image ? `${API_URL}${item.listingId.image}` : "/path/to/placeholder-image.jpg"}
                      alt={item.listingId.productName}
                      className="cart-item-image"
                      onError={(e) => (e.target.src = "/path/to/placeholder-image.jpg")}
                    />
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.listingId.productName}</h3>
                      <p className="cart-item-price">₹{item.listingId.price}</p>
                      <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveFromCart(item.listingId._id)}
                    className="remove-button"
                  >
                    <X size={16} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Total:₹{calculateTotal()}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;