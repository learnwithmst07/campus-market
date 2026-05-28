import React, { useState } from "react";
import API_URL from "../api";

function TestCart() {
  const [listingId, setListingId] = useState("");
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          listingId: listingId,
          quantity: 1,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleGetCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setCartItems(data);
      setMessage("Cart fetched successfully");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleRemoveFromCart = async (listingId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/remove/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      setMessage(data.message);
      // Refresh cart after removal
      handleGetCart();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Cart Endpoints</h2>
      <div>
        <label>
          Listing ID:
          <input
            type="text"
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            placeholder="Enter a valid listing ID"
          />
        </label>
      </div>
      <div style={{ margin: "10px 0" }}>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleGetCart} style={{ marginLeft: "10px" }}>
          Get Cart
        </button>
      </div>
      {message && <p>{message}</p>}
      {cartItems.length > 0 && (
        <div>
          <h3>Cart Items:</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                {item.listingId.productName} - Quantity: {item.quantity}
                <button
                  onClick={() => handleRemoveFromCart(item.listingId._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TestCart;