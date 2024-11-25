import React, { useEffect, useRef, useState } from 'react';
import './AboutPage.css';
import medicalImage from '../assets/image.png'; // Replace with your actual image path

const AboutPage = () => {
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once the image is visible
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the image is in view
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="about-container">
      <div className="content-wrapper">
        <div className="text-section">
          <h1>About Us</h1>
          <p>
            Welcome to Healthcare SaaS, your comprehensive solution for healthcare
            image analysis and measurement. We are committed to providing cutting-edge
            tools to streamline your healthcare imaging needs.
          </p>
          <p>
            Our platform offers features like image annotation, measurement tools, and
            an easy-to-use uploader to simplify your workflow. Thank you for trusting
            us to make healthcare technology more efficient!
          </p>
        </div>
        <div className="image-section">
          <img 
            src={medicalImage} 
            alt="Medical Illustration" 
            className={`about-image ${isVisible ? 'visible' : ''}`} 
            ref={imageRef}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
