import React from 'react';
import './Footer.css'; // Ensure you create and use a dedicated CSS file for footer styles
import { FaFacebook, FaTwitter, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'; // Importing React Icons

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            Healthcare SaaS is dedicated to providing top-notch software solutions for the healthcare industry. 
            Our mission is to improve patient outcomes and streamline healthcare processes.
          </p>
        </div>

        {/* Removed the Quick Links section */}

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><FaEnvelope /> Email: <a href="mailto:support@healthcaresaas.com">support@healthcaresaas.com</a></p>
          <p><FaPhoneAlt /> Phone: <a href="tel:+18001234567">+1 (800) 123-4567</a></p> {/* Link the phone number */}
          <p><FaMapMarkerAlt /> Address: 123 Healthcare Lane, MediCity, USA</p>
        </div>
      </div>

      <div className="footer-bottom">
        <h1>&copy; 2024 Healthcare SaaS. All rights reserved.</h1>
        <h2>
          Follow us on:
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a> |
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a> |
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
