const mongoose = require('mongoose');

// Define the ImageCount schema
const ImageCountSchema = new mongoose.Schema({
  companyid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',  // Reference to the Company model
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]  // Store month as a string
  },
  year: {
    type: Number,
    required: true
  },
  totalImagesProcessed: {
    type: Number,
    required: true,
    default: 0  // Start with 0 processed images
  }
}, { timestamps: true });

// Export the ImageCount model
const ImageCount = mongoose.model('ImageCount', ImageCountSchema);
module.exports = ImageCount;
