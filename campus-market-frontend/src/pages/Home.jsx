import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import { ArrowRight } from "lucide-react";
import ItemCard from "../components/ItemCard";
import placeholderImage from "../assets/react.svg"; 
import API_URL from "../api";
import "./FeaturedItems.css";

function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/listings/latest`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch listings");

        
        const mappedItems = data.map((listing, index) => {
          console.log("Listing Image URL:", listing.image ?[ `${API_URL}${listing.image}`] : "Using placeholder");
          return {
            id: listing._id,
            title: listing.productName,
            images: listing.image ? [`${API_URL}${listing.image}`] : [`${API_URL}/uploads/1750016933094.png`],
            condition: listing.condition.toLowerCase(),
            description: listing.description,
            sellerName: listing.userId?.fullName || "Unknown Seller", // Use the populated user's fullName
            sellerAvatar: "", // Not used, will display user icon instead
            university: "CampusMarket University", // Placeholder
            price: listing.price,
            createdDate: new Date(listing.createdAt).toISOString(),
            isFeatured: index === 0, // Mark the first item as featured
          };
        });
        setFeaturedItems(mappedItems);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFeaturedItems();
  }, []);

  return (
    <div>
      <Hero />
      <Categories />
      {/* <section className="featured-items">
        <div className="featured-items-container">
          <div className="featured-items-header">
            <div>
              <h2 className="featured-items-title">Featured Items</h2>
              <p className="featured-items-subtitle">Great deals from your fellow students</p>
            </div>
            <a href="/browse" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </a>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="featured-items-grid">
            {featuredItems.length > 0 ? (
              featuredItems.map((item) => <ItemCard key={item.id} item={item} />)
            ) : (
              <p>No featured items available.</p>
            )}
          </div>
        </div>
      </section> */}
      <section className="featured-items">
        <div className="featured-items-container">
          <div className="featured-items-header">
            <div>
              <h2 className="featured-items-title">Featured Items</h2>
              <p className="featured-items-subtitle">Great deals from your fellow students</p>
            </div>
            <a href="/browse" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </a>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="featured-items-grid">
            {featuredItems.length > 0 ? (
              featuredItems.map((item) => <ItemCard key={item.id} item={item} />)
            ) : (
              <p>No featured items available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;