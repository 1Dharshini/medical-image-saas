import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import './AnnotationTools.css'; 

const ImageAnnotation = () => {
  const { imageName } = useParams();
  const [imageObj, setImageObj] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState(null);
  const [file, setFile] = useState(null); // To handle the file input
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  // Load the image by URL or from file input
  useEffect(() => {
    if (imageName) {
      const imageUrl = `http://localhost:5000/uploads/${imageName}`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setImageObj(img);
    } else if (file) {
      const img = new Image();
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result;
        img.onload = () => setImageObj(img); // Ensure the state is set after the image is loaded
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }, [imageName, file]);

  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    setIsDrawing(true);
    setNewAnnotation({ x, y, width: 0, height: 0, color: 'red' });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newAnnotation) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    setNewAnnotation({ ...newAnnotation, width: x - newAnnotation.x, height: y - newAnnotation.y });
  };

  const handleMouseUp = () => {
    if (isDrawing && newAnnotation) {
      setAnnotations((prev) => [...prev, newAnnotation]);
      setNewAnnotation(null);
    }
    setIsDrawing(false);
  };

  const clearAnnotations = () => setAnnotations([]);

  const saveAnnotations = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `annotated-${imageName || 'new-image'}`;
      link.click();
    }
  };

  const handleFileButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Programmatically trigger the file input click event
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Set the selected file to state
    }
  };

  // Navigate to the Measurement Tool page
  const handleMeasurementToolClick = () => {
    if (!imageName && !file) {
      alert("Please upload or select an image first.");
      return;
    }
    
    const imageParam = imageName || 'new-image'; // Fallback to 'new-image' if imageName is not available
    navigate(`/measurement-tool/${imageParam}`);
  };

  return (
    <div>
      <h2>Annotate Image: {imageName || 'Upload a new image'}</h2>
      <div className="button-container">
  <button onClick={() => navigate('/view')}>Back to Gallery</button>
  <button onClick={clearAnnotations}>Clear Annotations</button>
  <button onClick={saveAnnotations}>Save Annotations</button>
</div>


      {/* File input to upload a new image */}
      {!imageObj && (
        <div>
          <label htmlFor="fileInput" className="file-upload-label">
            <button onClick={handleFileButtonClick}>Choose File</button>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Keep it hidden
          />
        </div>
      )}

      {/* Measurement Tool Button */}
      <button className='button-container' onClick={handleMeasurementToolClick}>Go to Measurement Tool</button>

      {/* Display stage with the loaded image */}
      {imageObj && (
        <Stage
          width={800}
          height={600}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            <KonvaImage
              image={imageObj}
              width={800}
              height={600}
              ref={imageRef}
            />
            {annotations.map((annotation, index) => (
              <Rect
                key={index}
                x={annotation.x}
                y={annotation.y}
                width={annotation.width}
                height={annotation.height}
                stroke={annotation.color}
                fill="transparent"
              />
            ))}
            {newAnnotation && (
              <Rect
                x={newAnnotation.x}
                y={newAnnotation.y}
                width={newAnnotation.width}
                height={newAnnotation.height}
                stroke={newAnnotation.color}
                fill="transparent"
              />
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default ImageAnnotation;
