const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Import cors
const path = require('path');
const fs = require('fs');

const app = express();
const uploadFolder = path.join(__dirname, 'public/uploads');

// Ensure the uploads folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// In-memory annotations storage (you can switch to a database for production)
let annotations = []; // Stores annotations by image name

// Upload endpoint
app.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'File uploaded successfully', filePath: fileUrl });
});

// Endpoint to fetch available images
app.get('/api/images', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Unable to read the uploads directory' });
    }

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp)$/i.test(file));
    res.json(imageFiles);
  });
});

// Save annotations for an image
app.post('/api/annotations', (req, res) => {
  const { imageName, annotationsData } = req.body;
  if (!imageName || !annotationsData) {
    return res.status(400).json({ error: 'Image name and annotations data are required' });
  }

  // Save annotations for the specific image
  annotations[imageName] = annotationsData;

  res.status(200).json({ message: 'Annotations saved successfully' });
});

// Get annotations for a specific image
app.get('/api/annotations/:imageName', (req, res) => {
  const { imageName } = req.params;
  const imageAnnotations = annotations[imageName] || [];
  res.status(200).json(imageAnnotations);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
