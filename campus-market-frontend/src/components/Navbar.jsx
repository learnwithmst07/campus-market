
// import React, { useState, useEffect } from "react";
// import { Search, ShoppingCart, User, Menu, X, Plus } from "lucide-react";
// import "./Navbar.css";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [user, setUser] = useState(null); // Track user authentication state
//   const [cartItems] = useState([]); // Mock cart data; replace with context if available

//   // Check session on mount to determine if user is logged in
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/auth/check-session", {
//           method: "GET",
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUser({ id: data.userId }); // Set user if logged in
// // Fetch cart items if user is logged in
//           fetchCart();
//         } else {
//           setUser(null); // No user logged in
//         }
//       } catch (error) {
//         console.error("Session check failed:", error);
//         setUser(null);
//       }
//     };

//     const fetchCart = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/cart", {
//           method: "GET",
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setCartItems(data);
//         } else {
//           setCartItems([]);
//         }
//       } catch (error) {
//         console.error("Fetch cart error:", error);
//         setCartItems([]);
//       }
//     };
//     checkSession();
//   }, []);

  

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
//     }
//   };
  

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setUser(null); // Clear user state
//         window.location.href = "/signin"; // Redirect to signin page
//       } else {
//         throw new Error(data.message || "Logout failed");
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         {/* Logo */}
//         <a href="/" className="navbar-logo">
//           <div className="logo-icon">
//             <span>CM</span>
//           </div>
//           <span className="logo-text-mt">CampusMarket</span>
//         </a>

//         {/* Search Bar - Desktop */}
//         <form onSubmit={handleSearch} className="navbar-search">
//           <div className="search-wrapper">
//             <input
//               type="text"
//               placeholder="Search for books, electronics, and more..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             <Search className="search-icon" size={16} />
//           </div>
//         </form>

//         {/* Desktop Navigation */}
//         <div className="navbar-links">
//           <a href="/browse" className="nav-button cart-button">
//             Browse
//           </a>
//           <a href="/sell" className="nav-button sell-button">
//             <Plus size={16} />
//             Sell Item
//           </a>
//           <a href="/cart" className="nav-button cart-button">
//             <ShoppingCart size={20} />
//             {cartItems.length > 0 && (
//               <span className="cart-badge">{cartItems.length}</span>
//             )}

//           </a>
//           {user ? (
//             <div className="user-actions">
//               <a href="/dashboard" className="nav-button profile-button">
//                 <User size={20} />
//               </a>
//               <button onClick={handleLogout} className="signup-button nav-button mt-logout">
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="auth-links">
//               <a href="/signin" className="nav-button login-button">
//                 Login
//               </a>
//               <a href="/signup" className="nav-button signup-button">
//                 Sign Up
//               </a>
//             </div>
//           )}
//         </div>

//         {/* Mobile menu button */}
//         <button
//           className="menu-toggle"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <div className="mobile-menu">
//           <form onSubmit={handleSearch} className="mobile-search">
//             <div className="search-wrapper">
//               <input
//                 type="text"
//                 placeholder="Search items..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//               <Search className="search-icon" size={16} />
//             </div>
//           </form>
//           <div className="mobile-links">
//             <a href="/browse" className="mobile-link">
//               Browse Items
//             </a>
//             <a href="/sell" className="mobile-link sell-button">
//               <Plus size={16} />
//               Sell Item
//             </a>
//             <a href="/cart" className="mobile-link">
//               <ShoppingCart size={16} />
//               Cart ({cartItems.length})
//             </a>
//             {user ? (
//               <>
//                 <a href="/dashboard" className="mobile-link profile-button">
//                   <User size={16} />
//                   Dashboard
//                 </a>
//                 <button onClick={handleLogout} className="signup-button nav-button mt-logout-m">
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <a href="/signin" className="mobile-link login-button">
//                   Login
//                 </a>
//                 <a href="/signup" className="mobile-link signup-button">
//                   Sign Up
//                 </a>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );}
import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Plus } from "lucide-react";
import API_URL from "../api";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Check session and fetch cart on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/check-session`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser({ id: data.userId });
          // Fetch cart items if user is logged in
          fetchCart();
        } else {
          setUser(null);
          setCartItems([]); // Clear cart if not logged in
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
        setCartItems([]);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cart`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setCartItems(data);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Fetch cart error:", error);
        setCartItems([]);
      }
    };

    checkSession();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(null);
        setCartItems([]); // Clear cart on logout
        window.location.href = "/signin";
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <div className="logo-icon">
            <span>CM</span>
          </div>
          <span className="logo-text-mt">Campus Market</span>
        </a>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="navbar-search">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search for books, electronics, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" size={16} />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <a href="/browse" className="nav-button cart-button">
            Browse
          </a>
          <a href="/sell" className="nav-button sell-button">
            <Plus size={16} />
            Sell Item
          </a>
          <a href="/cart" className="nav-button cart-button">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </a>
          {user ? (
            <div className="user-actions">
              <a href="/dashboard" className="nav-button profile-button">
                <User size={20} />
              </a>
              <button onClick={handleLogout} className="signup-button nav-button mt-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <a href="/signin" className="nav-button login-button">
                Login
              </a>
              <a href="/signup" className="nav-button signup-button">
                Sign Up
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Search className="search-icon" size={16} />
            </div>
          </form>
          <div className="mobile-links">
            <a href="/browse" className="mobile-link">
              Browse Items
            </a>
            <a href="/sell" className="mobile-link sell-button">
              <Plus size={16} />
              Sell Item
            </a>
            <a href="/cart" className="mobile-link">
              <ShoppingCart size={16} />
              Cart ({cartItems.length})
            </a>
            {user ? (
              <>
                <a href="/dashboard" className="mobile-link profile-button">
                  <User size={16} />
                  Dashboard
                </a>
                <button onClick={handleLogout} className="signup-button nav-button mt-logout-m">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/signin" className="mobile-link login-button">
                  Login
                </a>
                <a href="/signup" className="mobile-link signup-button">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}