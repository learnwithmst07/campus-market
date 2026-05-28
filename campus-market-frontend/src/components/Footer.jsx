import React, { useState } from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { Linkedin, X } from 'lucide-react';
import devAvatar1 from '../assets/dev_avatar_1.jpg';
import devAvatar2 from '../assets/dev_avatar_2.jpg';
import devAvatar3 from '../assets/dev_avatar_3.jpg';
import devAvatar4 from '../assets/dev_avatar_4.jpg';

const Footer = () => {
  const [showDevModal, setShowDevModal] = useState(false);

  const teamMembers = [
    {
      name: 'Tirthraj Shewale',
      role: 'Lead Developer',
      linkedin: 'https://www.linkedin.com/in/tirthraj-shewale-986072342/',
      linkedinHandle: 'tirthraj-shewale-986072342',
      image: devAvatar1,
    },
    {
      name: 'Karan Bankar',
      role: 'Backend Engineer',
      linkedin: 'https://www.linkedin.com/in/karan-bankar-453b57252/',
      linkedinHandle: 'karan-bankar-453b57252',
      image: devAvatar2,
    },
    {
      name: 'Nirali Unhale',
      role: 'UI/UX Designer',
      linkedin: 'https://www.linkedin.com/in/nirali-unhale-15662829b/',
      linkedinHandle: 'nirali-unhale-15662829b',
      image: devAvatar3,
    },
    {
      name: 'Anjali Tawade',
      role: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/anjali-tawde-66402a248/',
      linkedinHandle: 'anjali-tawde-66402a248',
      image: devAvatar4,
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section about">
          <div className="footer-logo">
            <div className="logo-circle">CM</div>
            <span className="logo-text">Campus Market</span>
          </div>
          <p className="footer-description">
            The trusted marketplace for college students to buy and sell used items.
            Connect with fellow students and find great deals on campus.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaEnvelope /></a>
          </div>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/browse">Browse Items</a></li>
            <li><a href="/sell">Sell Items</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>

        <div className="footer-section support">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety Tips</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Campus Market · Developed by{' '}
          <button
            className="dev-link-btn"
            onClick={() => setShowDevModal(true)}
          >
            Developer
          </button>
        </p>
      </div>

      {showDevModal && (
        <div className="dev-modal-overlay" onClick={() => setShowDevModal(false)}>
          <div className="dev-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="dev-modal-close" onClick={() => setShowDevModal(false)}>
              <X size={24} />
            </button>
            <h2 className="dev-modal-title">Our Developer Team</h2>
            <p className="dev-modal-subtitle">Meet the minds behind Campus Market</p>
            <div className="dev-team-grid">
              {teamMembers.map((member, index) => (
                <div className="dev-card" key={index}>
                  <div className="dev-avatar-wrapper">
                    <img src={member.image} alt={member.name} className="dev-avatar" />
                  </div>
                  <h3 className="dev-name">{member.name}</h3>
                  <p className="dev-role">{member.role}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dev-linkedin-link"
                  >
                    <Linkedin size={16} className="linkedin-icon" />
                    <span>@{member.linkedinHandle}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
