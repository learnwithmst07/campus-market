// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { MapPin, Clock, User, X, Phone, ShoppingCart } from "lucide-react";
// import placeholderImage from "../assets/react.svg";
// import "./ItemDetails.css";

// function ItemDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [item, setItem] = useState(null);
//   const [error, setError] = useState("");
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [cartMessage, setCartMessage] = useState("");

//   useEffect(() => {
//     // Check if user is logged in
//     const checkAuth = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/auth/check-auth`, {
//           credentials: "include",
//         });
//         const data = await response.json();
//         console.log("ItemDetails Auth Check Response:", data); // Debug log
//         if (response.ok && data.isAuthenticated) {
//           setIsLoggedIn(true);
//         } else {
//           setIsLoggedIn(false);
//         }
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         setIsLoggedIn(false);
//       }
//     };

//     const fetchItem = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/listings/${id}`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to fetch listing");

//         console.log("Fetched Item Data:", data);

//         setItem({
//           id: data._id,
//           title: data.productName || "Untitled",
//           image: data.image ? `${API_URL}${data.image}` : placeholderImage,
//           condition: data.condition ? data.condition.toLowerCase() : "unknown",
//           description: data.description || "No description available",
//           sellerName: data.userId?.fullName || "Unknown Seller",
//           university: data.userId?.university || "Unknown University",
//           price: data.price ? data.price.toString() : "0",
//           createdDate: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
//           mobileNumber: data.mobileNumber || "Not provided",
//           category: data.category || "Uncategorized",
//         });
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     checkAuth();
//     fetchItem();
//   }, [id]);

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

//   const handleAddToCart = async () => {
//     if (!isLoggedIn) {
//       setCartMessage("Please log in to add items to your cart.");
//       console.log("User not logged in, redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//       return;
//     }

//     try {
//       console.log("Adding to cart, listingId:", id, "User logged in:", isLoggedIn); // Debug log
//       const response = await fetch(`${API_URL}/api/cart/add`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ listingId: id, quantity: 1 }),
//       });

//       const data = await response.json();
//       console.log("Add to Cart Response:", data); // Debug log
//       if (!response.ok) throw new Error(data.message || "Failed to add to cart");

//       setCartMessage("Item added to cart successfully!");
//       setTimeout(() => {
//         setCartMessage("");
//         navigate("/cart"); // Redirect to cart page after success
//       }, 2000);
//     } catch (err) {
//       console.error("Add to Cart Error:", err.message);
//       setCartMessage(err.message);
//       setTimeout(() => setCartMessage(""), 3000);
//     }
//   };

//   if (error) return <div className="error-message">{error}</div>;
//   if (!item) return <div>Loading...</div>;

//   return (
//     <div className="item-details-page">
//       <div className="item-details-container">
//         <Link to="/" className="back-link">
//           ← Back to Home
//         </Link>
//         <div className="item-details-content">
//           <div className="item-details-image-section">
//             <img
//               src={item.image}
//               alt={item.title}
//               onError={handleImageError}
//               className="item-image"
//             />
//           </div>
//           <div className="item-details-info-section">
//             <h1 className="item-details-title">{item.title}</h1>
//             <div className="item-details-meta">
//               <span className={`condition-badge ${getConditionColor(item.condition)}`}>
//                 {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
//               </span>
//               <span className="item-details-date">
//                 <Clock size={16} className="date-icon" />
//                 Posted {formatDate(item.createdDate)}
//               </span>
//             </div>
//             <p className="item-details-price">${item.price}</p>
//             <div className="item-details-seller">
//               <div className="seller-info">
//                 <User size={20} className="seller-icon" />
//                 <span className="seller-name">{item.sellerName}</span>
//               </div>
//               <div className="university-info">
//                 <MapPin size={16} className="university-icon" />
//                 <span>{item.university}</span>
//               </div>
//             </div>
//             <div className="item-details-buttons">
//               <button
//                 onClick={() => setShowContactModal(true)}
//                 className="contact-button"
//               >
//                 <Phone size={16} className="contact-icon" />
//                 Contact Seller
//               </button>
//               <button
//                 onClick={handleAddToCart}
//                 className="add-to-cart-button"
//                 disabled={!isLoggedIn} // Disable button if not logged in
//               >
//                 <ShoppingCart size={16} className="cart-icon" />
//                 Add to Cart
//               </button>
//             </div>
//             {cartMessage && <p className="cart-message">{cartMessage}</p>}
//             <div className="item-details-description-section">
//               <h3>Product Details</h3>
//               <p className="item-details-description">
//                 <strong>Category:</strong> {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
//               </p>
//               <p className="item-details-description">{item.description}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showContactModal && (
//         <div className="contact-modal-overlay">
//           <div className="contact-modal">
//             <button
//               onClick={() => setShowContactModal(false)}
//               className="modal-close-button"
//             >
//               <X size={24} />
//             </button>
//             <h3>Contact Seller</h3>
//             <div className="contact-modal-content">
//               <p>
//                 <strong>Seller:</strong> {item.sellerName}
//               </p>
//               <p>
//                 <strong>Phone Number:</strong> {item.mobileNumber}
//               </p>
//             </div>
//             <button
//               onClick={() => setShowContactModal(false)}
//               className="modal-close-button-text"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ItemDetails;
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Clock, User, X, Phone, ShoppingCart } from "lucide-react";
import placeholderImage from "../assets/react.svg";
import API_URL from "../api";
import "./ItemDetails.css";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/check-auth`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.isAuthenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };

    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/api/listings/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch listing");

        console.log("Fetched Item Data:", data);

        setItem({
          id: data._id,
          title: data.productName || "Untitled",
          image: data.image ? `${API_URL}${data.image}` : placeholderImage,
          condition: data.condition ? data.condition.toLowerCase() : "unknown",
          description: data.description || "No description available",
          sellerName: data.userId?.fullName || "Unknown Seller",
          university: data.userId?.university || "Unknown University",
          class: data.userId?.class || "Not provided",
          branch: data.userId?.branch || "Not provided",
          price: data.price ? data.price.toString() : "0",
          createdDate: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
          mobileNumber: data.mobileNumber || "Not provided",
          category: data.category || "Uncategorized",
        });
      } catch (err) {
        setError(err.message);
      }
    };

    checkAuth();
    fetchItem();
  }, [id]);

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

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setCartMessage("Please log in to add items to your cart.");
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId: id, quantity: 1 }),
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

  if (error) return <div className="error-message">{error}</div>;
  if (!item) return <div>Loading...</div>;

  return (
    <div className="item-details-page">
      <div className="item-details-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <div className="item-details-content">
          <div className="item-details-image-section">
            <img
              src={item.image}
              alt={item.title}
              onError={handleImageError}
              className="mt-item-image"
            />
          </div>
          <div className="item-details-info-section">
            <h1 className="item-details-title">{item.title}</h1>
            {item.description}
            <div className="item-details-meta">
              <span className={`condition-badge ${getConditionColor(item.condition)}`}>
                {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
              </span>
              <span className="item-details-date">
                <Clock size={16} className="date-icon" />
                Posted {formatDate(item.createdDate)}
              </span>
            </div>
            <p className="item-details-price">₹{item.price}</p>
            <div className="item-details-seller">
                <p className="mt-seller-text">Seller</p>
              <div className="seller-info mt-seller-info">
                <User size={20} className="seller-icon" />
                <span className="seller-name">{item.sellerName}</span>
              </div>
              {/* <p>The {item.sellerName} Sells this product.</p> */}
              <div className="university-info">
                {/* <MapPin size={16} className="university-icon" /> */}
                {/* <span>{item.university}</span> */}
                <p>The {item.sellerName} Sells this product.</p>
              </div>
            </div>
            
            {cartMessage && <p className="cart-message">{cartMessage}</p>}
            <div className="item-details-description-section">
              <h3>Product Details</h3>
              <p className="item-details-description">
                <strong>Category:</strong> {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </p>
              {/* <p className="item-details-description">
                <strong>Description:</strong> {item.description}
                </p> */}
                <p className="item-details-description">
                <strong>Condition:</strong> {item.condition}
                </p>
                <p className="item-details-description">
                <strong>CreatedDate:</strong> {formatDate(item.createdDate)}
                </p>
                <p className="item-details-description">
                <strong>Prize:</strong> ₹{item.price}
                </p>
               
            </div>
            <div className="item-details-buttons">
              <button
                onClick={() => setShowContactModal(true)}
                className="contact-button"
              >
                <Phone size={16} className="contact-icon" />
                Contact Seller
              </button>
              <button
                onClick={handleAddToCart}
                className="add-to-cart-button"
                disabled={cartMessage.includes("successfully")} // Disable button after successful addition
              >
                <ShoppingCart size={16} className="cart-icon" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="contact-modal-overlay">
          <div className="contact-modal">
            <button
              onClick={() => setShowContactModal(false)}
              className="modal-close-button"
            >
              <X size={24} />
            </button>
            <h3>Contact Seller</h3>
            <div className="contact-modal-content">
              <p>
                <strong>Seller:</strong> {item.sellerName}
              </p>
              <p>
                <strong>Class:</strong> {item.class}
              </p>
              <p>
                <strong>Branch:</strong> {item.branch}
              </p>
              <p>
                <strong>Phone Number:</strong> {item.mobileNumber}
              </p>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="modal-close-button-text"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;