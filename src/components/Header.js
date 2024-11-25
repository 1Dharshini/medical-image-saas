// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a separate CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <nav>
        <div className="logo">
          <Link to="/">Healthcare SaaS</Link> {/* Logo or brand name */}
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li> {/* Home page link */}
          <li><Link to="/upload">Upload Image</Link></li>
          <li><Link to="/view">View Image</Link></li>
          <li><Link to="/annotate">Annotate Image</Link></li>
          <li><Link to="/measure">Measure Distance</Link></li>
          <li className="dropdown">
            <span>More</span>
            <ul className="dropdown-menu">
              <li><Link to="/about">About</Link></li> {/* About page link */}
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
