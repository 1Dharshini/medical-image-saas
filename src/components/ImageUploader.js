import React, { useState } from 'react';
import './ImageUploader.css'; 

const ImageUploader = () => {
  const [file, setFile] = useState(null); // Selected file
  const [preview, setPreview] = useState(null); // Preview image
  const [error, setError] = useState(null); // Error message

  // Handle file selection and preview generation
  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/dcm'];
    if (!selectedFile || !validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload an image (PNG, JPG, JPEG, or DICOM).');
      setFile(null);
      setPreview(null);
      return;
    }

    // Clear previous errors and set the file
    setError(null);
    setFile(selectedFile);

    // Generate image preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result); // Set preview as base64 string
    reader.readAsDataURL(selectedFile);
  };

  // Handle image upload to the backend
  const handleFileUpload = async () => {
    if (!file) {
      setError('No file selected. Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      alert('File uploaded successfully!');
      console.log('Uploaded file path:', data.filePath);

      // Reset the state to allow fresh uploads
      setFile(null);
      setPreview(null);
      setError(null);

      // Optional: Refresh the page
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Image</h2>
      <input type="file" accept="image/png, image/jpeg, image/jpg, .dcm" onChange={handleFileSelection} />
      {error && <p className="error-message">{error}</p>} {/* Display error */}
      {preview && (
        <div className="image-preview">
          <h3>Image Preview:</h3>
          <img src={preview} alt="Image preview" style={{ width: '200px', height: 'auto' }} />
          <button onClick={handleFileUpload} className="upload-btn">
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
