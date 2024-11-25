import React, { useState, useRef, useEffect } from 'react';
import { convertPixelsToRealWorld } from '../utils/convertPixels'; // Ensure this is correct
import { useNavigate, useParams } from 'react-router-dom';
import './MeasurementTool.css';

const MeasurementPage = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { imageName } = useParams();
  const navigate = useNavigate();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [unit, setUnit] = useState('mm');
  const [pixelSpacing, setPixelSpacing] = useState(0.1);
  const [measurementColor, setMeasurementColor] = useState('#3498db');
  const [imageObj, setImageObj] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      contextRef.current = canvas.getContext('2d');
    }
  }, []);

  const loadImage = () => {
    const ctx = contextRef.current;
    const image = new Image();
    const imageUrl = `http://localhost:5000/uploads/${imageName}`;
    image.crossOrigin = 'Anonymous'; // Handle CORS issues if required

    image.src = imageUrl;

    image.onload = () => {
      // Set canvas size to match image size
      const canvas = canvasRef.current;
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      setImageObj(image);
      redrawMeasurements();
    };

    image.onerror = () => {
      alert('Failed to load image.');
    };
  };

  useEffect(() => {
    if (imageName) {
      loadImage();
    }
  }, [imageName]);

  const redrawMeasurements = () => {
    const ctx = contextRef.current;
    measurements.forEach(({ start, end, color, lineStyle, measurementNumber }) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.setLineDash(lineStyle === 'dashed' ? [5, 5] : []);
      ctx.stroke();

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      ctx.fillStyle = color;
      ctx.font = '14px Arial';
      ctx.fillText(`Measurement ${measurementNumber}`, midX + 5, midY - 5);
    });
  };

  const handleCanvasClick = (e) => {
    if (!isMeasuring) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!startPoint) {
      setStartPoint({ x, y });
    } else {
      const newEndPoint = { x, y };

      const pixelDistance = Math.sqrt(
        Math.pow(newEndPoint.x - startPoint.x, 2) + Math.pow(newEndPoint.y - startPoint.y, 2)
      );

      const realWorldDist = convertPixelsToRealWorld(pixelDistance, pixelSpacing);

      const newMeasurement = {
        start: startPoint,
        end: newEndPoint,
        distance: pixelDistance,
        realWorldDistance: isNaN(realWorldDist) ? 'N/A' : realWorldDist,
        color: measurementColor,
        lineStyle: measurements.length % 2 === 0 ? 'dashed' : 'solid',
        measurementNumber: measurements.length + 1,
      };

      setMeasurements((prev) => [...prev, newMeasurement]);

      const ctx = contextRef.current;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(newEndPoint.x, newEndPoint.y);
      ctx.strokeStyle = measurementColor;
      ctx.lineWidth = 2;
      ctx.setLineDash(newMeasurement.lineStyle === 'dashed' ? [5, 5] : []);
      ctx.stroke();

      const midX = (startPoint.x + newEndPoint.x) / 2;
      const midY = (startPoint.y + newEndPoint.y) / 2;
      ctx.fillStyle = measurementColor;
      ctx.font = '14px Arial';
      ctx.fillText(`Measurement ${measurements.length + 1}`, midX + 5, midY - 5);

      setStartPoint(null); // Reset start point after adding measurement
    }
  };

  const toggleMeasurement = () => {
    setIsMeasuring((prev) => !prev);
    setStartPoint(null);
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setStartPoint(null);

    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadImage(); // Reload the image to reset the canvas
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'measurement.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadMeasurements = () => {
    const data = measurements.map((measurement, index) => ({
      measurementNumber: index + 1,
      startPoint: measurement.start,
      endPoint: measurement.end,
      distanceInPixels: measurement.distance.toFixed(2),
      realWorldDistance:
        typeof measurement.realWorldDistance === 'number' && !isNaN(measurement.realWorldDistance)
          ? measurement.realWorldDistance.toFixed(2)
          : 'N/A',
      unit,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'measurements.json';
    link.click();
  };

  return (
    <div>
      <h2>Measurement Page</h2>
      
        <button className='button-container'>
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={toggleMeasurement}>
          {isMeasuring ? 'Cancel Measurement' : 'Start Measurement'}
        </button>
        <button onClick={clearMeasurements}>Clear</button>
        <button onClick={saveCanvas}>Save Image</button>
        <button onClick={downloadMeasurements}>Download Measurements</button>
        </button>
      
      <div className="settings">
        <label>
          Unit:
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="m">m</option>
          </select>
        </label>
        <label>
          Pixel Spacing:
          <input
            type="number"
            value={pixelSpacing}
            onChange={(e) => setPixelSpacing(parseFloat(e.target.value))}
            step="0.01"
            min="0.01"
          />
        </label>
        <label>
          Line Color:
          <input
            type="color"
            value={measurementColor}
            onChange={(e) => setMeasurementColor(e.target.value)}
          />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: '1px solid black', marginTop: '20px' }}
        onClick={handleCanvasClick}
      ></canvas>

      <h3>Measurements:</h3>
      <ul>
        {measurements.map((measurement, index) => (
          <li key={index}>
            Measurement {index + 1}: {measurement.distance.toFixed(2)} pixels,{' '}
            {typeof measurement.realWorldDistance === 'number' && !isNaN(measurement.realWorldDistance)
              ? measurement.realWorldDistance.toFixed(2)
              : 'N/A'}{' '}
            {unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeasurementPage;
