
// import React from "react";
// import { Link } from "react-router-dom";
// import { Heart, MapPin, Clock, User } from "lucide-react";
// import placeholderImage from "../assets/react.svg";
// import "./ItemCard.css";

// const ItemCard = ({ item }) => {
//   const addToCart = (item) => {
//     console.log(`Added ${item.title} to cart`);
//   };

//   const getConditionColor = (condition) => {
//     switch (condition) {
//       case "new":
//         return "bg-green text-green-text";
//       case "like-new":
//         return "bg-blue text-blue-text";
//       case "good":
//         return "bg-yellow text-yellow-text";
//       case "fair":
//         return "bg-orange text-orange-text";
//       case "poor":
//         return "bg-red text-red-text";
//       default:
//         return "bg-gray text-gray-text";
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Today";
//     if (diffDays === 2) return "Yesterday";
//     if (diffDays <= 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   const handleImageError = (e) => {
//     e.target.src = placeholderImage;
//   };

//   return (
//     <div className="item-card">
//       <div className="item-image-container">
//         <Link to={`/item/${item.id}`}>
//           <img
//             src={item.images[0]}
//             alt={item.title}
//             className="item-image"
//             onError={handleImageError}
//           />
//         </Link>
//         <button className="favorite-button">
//           <Heart size={18} className="favorite-icon" />
//         </button>
//         {item.isFeatured && (
//           <div className="featured-badge">
//             Featured
//           </div>
//         )}
//       </div>

//       <div className="item-content">
//         <div className="item-header">
//           <Link to={`/item/${item.id}`} className="item-title-link">
//             <h3 className="item-title">{item.title}</h3>
//           </Link>
//           <span className={`condition-badge ${getConditionColor(item.condition)}`}>
//             {item.condition}
//           </span>
//         </div>

//         <p className="item-description">{item.description}</p>

//         <div className="seller-info">
//           <User size={24} className="seller-icon" />
//           <span className="seller-name">{item.sellerName}</span>
//           <div className="university-info">
//             <MapPin size={12} className="university-icon" />
//             {item.university}
//           </div>
//         </div>

//         <div className="item-footer">
//           <div>
//             <span className="item-price">${item.price}</span>
//             <div className="date-info">
//               <Clock size={12} className="date-icon" />
//               {formatDate(item.createdDate)}
//             </div>
//           </div>
//           <button
//             onClick={() => addToCart(item)}
//             className="add-to-cart-button"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemCard;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Clock, User } from "lucide-react";
import placeholderImage from "../assets/react.svg";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check-auth", {
          credentials: "include",
        });
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const addToCart = async (item) => {
    if (!isLoggedIn) {
      setCartMessage("Please log in to add items to your cart.");
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId: item.id, quantity: 1 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add to cart");

      setCartMessage("Item added to cart successfully!");
      setTimeout(() => {
        setCartMessage("");
        navigate("/cart");
      }, 2000);
    } catch (err) {
      console.error("Add to Cart Error:", err.message);
      setCartMessage(err.message);
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "new":
        return "bg-green text-green-text";
      case "like-new":
        return "bg-blue text-blue-text";
      case "good":
        return "bg-yellow text-yellow-text";
      case "fair":
        return "bg-orange text-orange-text";
      case "poor":
        return "bg-red text-red-text";
      default:
        return "bg-gray text-gray-text";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  return (
    <div className="item-card">
      <div className="item-image-container">
        <Link to={`/item/${item.id}`}>
          <img
            src={item.images[0]}
            alt={item.title}
            className="item-image"
            onError={handleImageError}
          />
        </Link>
        <button className="favorite-button">
          <Heart size={18} className="favorite-icon" />
        </button>
        {item.isFeatured && (
          <div className="featured-badge">
            Featured
          </div>
        )}
      </div>

      <div className="item-content">
        <div className="item-header">
          <Link to={`/item/${item.id}`} className="item-title-link">
            <h3 className="item-title">{item.title}</h3>
          </Link>
          <span className={`condition-badge ${getConditionColor(item.condition)}`}>
            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </span>
        </div>

        <p className="item-description">{item.description}</p>

        {/* <div className="seller-info">
          <User size={24} className="seller-icon" />
          <span className="seller-name">{item.sellerName}</span>
          <div className="university-info">
            <MapPin size={12} className="university-icon" />
            {item.university}
          </div>
        </div> */}

        <div className="item-footer">
          <div className="mt-cart-prize">
            <span className="item-price">₹{item.price}</span>
            <div className="date-info">
              <Clock size={12} className="date-icon" />
              {formatDate(item.createdDate)}
            </div>
          </div>
          <button
            onClick={() => addToCart(item)}
            className="add-to-cart-button"
            disabled={cartMessage.includes("successfully")}
          >
            Add to Cart
          </button>
        </div>
        {cartMessage && <p className="cart-message">{cartMessage}</p>}
      </div>
    </div>
  );
};

export default ItemCard;