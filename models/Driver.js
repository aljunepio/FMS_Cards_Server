const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  issueDate: { type: String, required: true },
  photoUrl: { type: String }, // We will store the image URL here
  logoUrl: { type: String },  // We will store the logo URL here
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', DriverSchema);
