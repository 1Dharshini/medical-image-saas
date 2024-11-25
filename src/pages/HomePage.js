import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './HomePage.css'; // Import the CSS for styling

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Text section overlaid on the image */}
      <div className="overlay">
        <h1>Professional Family Health Care</h1>
        <p>Create your medical website using Healthcare SaaS.</p>
        {/* Call-to-action buttons */}
        <div className="cta-container">
          {/* Link to About page using Link component */}
          <Link to="/about" className="cta-button">Learn More</Link>
          {/* Link to Contact page using Link component */}
          <Link to="/contact" className="cta-button secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
