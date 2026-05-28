import React from "react";
import { BookOpen, Laptop, Calculator, Headphones, Backpack, Coffee } from "lucide-react";
import "./Categories.css";

const categories = [
  { name: "Textbooks", icon: BookOpen, color: "bg-blue", textColor: "text-blue", href: "/browse?category=textbooks" },
  { name: "Electronics", icon: Laptop, color: "bg-teal", textColor: "text-teal", href: "/browse?category=electronics" },
  { name: "Calculators", icon: Calculator, color: "bg-purple", textColor: "text-purple", href: "/browse?category=calculators" },
  { name: "Audio", icon: Headphones, color: "bg-pink", textColor: "text-pink", href: "/browse?category=audio" },
  { name: "Accessories", icon: Backpack, color: "bg-green", textColor: "text-green", href: "/browse?category=accessories" },
  { name: "Lifestyle", icon: Coffee, color: "bg-orange", textColor: "text-orange", href: "/browse?category=lifestyle" },
];

export default function Categories() {
  return (
    <section className="categories">
      <div className="categories-container">
        <h2 className="categories-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <a key={category.name} href={category.href} className="category-card">
              <div className={`category-icon-wrapper ${category.color}`}>
                <category.icon size={32} className={category.textColor} />
              </div>
              <p className={`category-name ${category.textColor}`}>{category.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}