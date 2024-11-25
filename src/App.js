import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Using Routes instead of Switch
import { ImageProvider } from './context/ImageContext';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import AnnotationTool from './components/AnnotationTool';
import MeasurementTool from './components/MeasurementTool';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // Assuming you have a HomePage component
import About from './pages/AboutPage'; // Import the About page component
import Contact from './pages/ContactPage'; // Import the Contact page component

const App = () => {
  return (
    <ImageProvider> {/* Wrap the application with the ImageProvider context */}
      <Router>
        <div className="app-container">
          <Header /> {/* Display the header on all pages */}
          
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<HomePage />} /> {/* Home page route */}
            <Route path="/upload" element={<ImageUploader />} />
            <Route path="/view" element={<ImageViewer />} />
            <Route path="/annotate" element={<AnnotationTool />} />
            <Route path="/measure" element={<MeasurementTool />} />
            <Route path="/annotate/:imageName" element={<AnnotationTool />} /> {/* Dynamic route for annotating */}
            <Route path="/measurement-tool/:imageName" element={<MeasurementTool />} /> {/* Dynamic route for measuring */}
            
            {/* Add routes for About and Contact pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

          <Footer /> {/* Display the footer on all pages */}
        </div>
      </Router>
    </ImageProvider>
  );
};

export default App;
