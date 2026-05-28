import React from "react";
import { Search, BookOpen, Laptop, Calculator } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          Buy & Sell with
          <span className="hero-title-highlight"> Fellow Students</span>
        </h1>
        <p className="hero-description">
          The trusted marketplace for college students. Find great deals on textbooks, electronics, and more from students on your campus.
        </p>
        <div className="hero-buttons">
          <a href="/browse" className="hero-button primary-button">
            <Search size={20} className="button-icon" />
            Start Shopping
          </a>
          <a href="/sell" className="hero-button secondary-button">
            Sell Your Items
          </a>
        </div>

        {/* Feature Icons */}
        <div className="hero-features">
          <div className="feature-item">
            <BookOpen size={32} className="feature-icon text-blue" />
            <span className="feature-text">Textbooks</span>
          </div>
          <div className="feature-item">
            <Laptop size={32} className="feature-icon text-teal" />
            <span className="feature-text">Electronics</span>
          </div>
          <div className="feature-item">
            <Calculator size={32} className="feature-icon text-purple" />
            <span className="feature-text">Supplies</span>
          </div>
        </div>
      </div>
    </section>
  );
}