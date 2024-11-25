import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageViewer.css'; // Ensure you have proper styling

const ImageViewer = () => {
  const canvasRef = useRef(null); // Main canvas for image
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const navigate = useNavigate();

  // Fetch all images from the API
  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/images');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError('Failed to fetch images.');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const loadImage = () => {
    if (!selectedImage) {
      setError('No image data provided.');
      setLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setLoading(true);
    setError(null);

    const imageUrl = `http://localhost:5000/uploads/${selectedImage}`;
    const image = new Image();
    image.crossOrigin = 'Anonymous'; // Enable CORS for external images

    image.src = imageUrl;
    image.onload = () => {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2); // Center on canvas
      ctx.rotate((rotation * Math.PI) / 180); // Apply rotation
      ctx.scale(zoomLevel, zoomLevel); // Apply zoom
      ctx.drawImage(image, -image.width / 2, -image.height / 2); // Center the image
      ctx.restore();
      setLoading(false);
    };

    image.onerror = () => {
      setError('Failed to load image.');
      setLoading(false);
    };
  };

  useEffect(() => {
    loadImage();
  }, [selectedImage, zoomLevel, rotation]);

  return (
    <div>
      <h2>Image Gallery</h2>
      <div className="image-list">
        {images.map((image) => (
          <div
            key={image}
            className="image-thumbnail"
            onClick={() => setSelectedImage(image)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={`http://localhost:5000/uploads/${image}`}
              alt={image}
              width="100"
              height="100"
              className="thumbnail"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="viewer-container">
          <h2>View Image: {selectedImage}</h2>
          {loading && <div className="spinner">Loading...</div>}
          {error && <p className="error-message">{error}</p>}

          <canvas ref={canvasRef} className="canvas" width="600" height="600"></canvas>

          {/* Controls */}
          <div className="controls">
            <button className="control-btn" onClick={() => setZoomLevel((z) => Math.min(z * 1.2, 5))}>Zoom In</button>
            <button className="control-btn" onClick={() => setZoomLevel((z) => Math.max(z / 1.2, 0.2))}>Zoom Out</button>
            <button className="control-btn" onClick={() => setRotation((r) => (r + 90) % 360)}>Rotate</button>
            <button className="control-btn" onClick={() => navigate(`/annotate/${selectedImage}`)}>
              Annotate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
