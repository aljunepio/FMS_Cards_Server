const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read JSON data

// 1. Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ Missing MONGO_URI environment variable. Add MONGO_URI to your .env file.");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ Connection Error:", err));

// 2. Simple Test Route
app.get('/', (req, res) => {
  res.send("ID Card Server is Running!");
});

const Driver = require('./models/Driver');

// ROUTE 1: Save a new driver (POST)
app.post('/api/drivers', async (req, res) => { 
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE 2: Get all drivers (GET)
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'driver_photos',
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Keeps photos high-res but manageable
  },
});

const upload = multer({ storage: storage });

// THE UPLOAD ROUTE
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path }); // This sends the Cloudinary URL back to React
});


// 3. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
