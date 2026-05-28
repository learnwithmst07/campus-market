
// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import ItemCard from "../components/ItemCard.jsx";
// import "./Browse.css";

// function Browse() {
//   const [listings, setListings] = useState([]);
//   const [error, setError] = useState("");
//   const location = useLocation();

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/listings");
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error("Fetch listings failed:", response.status, errorText);
//           throw new Error(`Failed to fetch listings: ${response.status} - ${errorText}`);
//         }
//         const data = await response.json();
//         console.log("Fetched listings:", data);

//         // Format the listings data to match ItemCard props
//         const formattedListings = data.map((listing) => ({
//           id: listing._id,
//           title: listing.productName || "Untitled",
//           images: [listing.image ? `http://localhost:5000${listing.image}` : "/path/to/placeholder-image.jpg"],
//           condition: listing.condition ? listing.condition.toLowerCase() : "unknown",
//           description: listing.description || "No description available",
//           price: listing.price ? listing.price.toString() : "0",
//           createdDate: listing.createdAt ? new Date(listing.createdAt).toISOString() : new Date().toISOString(),
//           sellerName: listing.userId?.fullName || "Unknown Seller",
//           university: listing.userId?.university || "Unknown University",
//           isFeatured: false, // Not featured on browse page
//         }));

//         // Apply search filter if query exists
//         const searchParams = new URLSearchParams(location.search);
//         const searchQuery = searchParams.get("search")?.toLowerCase() || "";
//         const filteredListings = searchQuery
//           ? formattedListings.filter(
//               (listing) =>
//                 listing.title.toLowerCase().includes(searchQuery) ||
//                 listing.sellerName.toLowerCase().includes(searchQuery) ||
//                 listing.university.toLowerCase().includes(searchQuery)
//             )
//           : formattedListings;

//         setListings(filteredListings);
//       } catch (err) {
//         console.error("Fetch listings error:", err);
//         setError(err.message);
//       }
//     };

//     fetchListings();
//   }, [location.search]);

//   if (error) return <div className="browse-error">{error}</div>;
//   if (listings.length === 0) {
//     return (
//       <div className="browse-empty">
//         <p>No listings found.</p>
//         <Link to="/sell" className="sell-link">
//           Sell an Item
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="browse-page">
//       <div className="browse-container">
//         <h1 className="browse-title">Browse Listings</h1>
//         <div className="listings-grid">
//           {listings.map((listing) => (
//             <ItemCard key={listing.id} item={listing} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Browse;
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import ItemCard from "../components/ItemCard.jsx";
import "./Browse.css";

function Browse() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const conditions = ["New", "Like-New", "Good", "Fair", "Poor"];

  // Initialize search query from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryFromUrl = searchParams.get("search")?.toLowerCase() || "";
    setSearchQuery(queryFromUrl);
  }, [location.search]); // Only run when location.search changes

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch listings failed:", response.status, errorText);
          throw new Error(`Failed to fetch listings: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log("Fetched listings:", data);

        // Format the listings data to match ItemCard props
        const formattedListings = data.map((listing) => ({
          id: listing._id,
          title: listing.productName || "Untitled",
          images: [listing.image ? `http://localhost:5000${listing.image}` : "/path/to/placeholder-image.jpg"],
          condition: listing.condition ? listing.condition.toLowerCase() : "unknown",
          description: listing.description || "No description available",
          price: listing.price ? listing.price.toString() : "0",
          createdDate: listing.createdAt ? new Date(listing.createdAt).toISOString() : new Date().toISOString(),
          sellerName: listing.userId?.fullName || "Unknown Seller",
          university: listing.userId?.university || "Unknown University",
          isFeatured: false,
          category: listing.category || "Uncategorized",
        }));

        setListings(formattedListings);

        // Extract unique categories from listings
        const uniqueCategories = [...new Set(formattedListings.map((listing) => listing.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Fetch listings error:", err);
        setError(err.message);
      }
    };

    fetchListings();
  }, []);

  // Apply filters when searchQuery, selectedCategory, selectedCondition, or listings change
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery) ||
          listing.sellerName.toLowerCase().includes(searchQuery) ||
          listing.university.toLowerCase().includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((listing) => listing.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter((listing) => listing.condition.toLowerCase() === selectedCondition.toLowerCase());
    }

    setFilteredListings(filtered);
  }, [searchQuery, selectedCategory, selectedCondition, listings]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    if (searchQuery) {
      searchParams.set("search", searchQuery);
    } else {
      searchParams.delete("search");
    }
    window.history.replaceState(null, "", `${location.pathname}?${searchParams.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedCondition("");
    window.history.replaceState(null, "", location.pathname); // Clear URL params
  };

  if (error) return <div className="browse-error">{error}</div>;

  return (
    <div className="browse-page">
      <div className="browse-container">
        <h1 className="browse-title">Browse Listings</h1>

        {/* Search and Filters Section */}
        <div className="browse-controls">
          <form onSubmit={handleSearchSubmit} className="browse-search-form">
            <div className="browse-search-wrapper">
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => {
                  console.log("Input changed:", e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="browse-search-input"
              />
              <Search className="browse-search-icon" size={16} />
            </div>
          </form>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="condition-filter">Condition:</label>
              <select
                id="condition-filter"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                <option value="">All Conditions</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || selectedCategory || selectedCondition) && (
              <button onClick={handleClearFilters} className="clear-filters-button">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="browse-empty">
            <p>No listings found.</p>
            <Link to="/sell" className="sell-link">
              Sell an Item
            </Link>
          </div>
        ) : (
          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <ItemCard key={listing.id} item={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;