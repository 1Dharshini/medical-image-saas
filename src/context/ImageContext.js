import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageData, setImageData] = useState(null); // Current image data
  const [storedImages, setStoredImages] = useState([]); // List of stored images

  const storeImage = (image) => {
    setStoredImages((prevImages) => [...prevImages, image]); // Add image to stored images
  };

  return (
    <ImageContext.Provider value={{ imageData, setImageData, storedImages, storeImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
