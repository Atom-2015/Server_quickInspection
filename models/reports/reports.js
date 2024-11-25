
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  inspaction_name: {
    type: String,
    required: true
  },
  inspaction_type: {
    type: String,
    // enum: ["Power Line", "Building", "Thermal", "Wind Turbine", "Infrastructure"],
    required: true
  },
  display_coordinates_system: {
    type: String,
    // required: true
  },
  inspaction_company_owner: {
    type: String,
    required: true
  }, 
  user_email: {
    type: String,
    required: true
  },
  image: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'ImageProcessed'  // Store references to ImageProcessed documents
 }],
  image_on_cloudanary_uri: [{
    type: String
  }],
  totalImagesProcessed: {
    type: Number,
    default: 0  // Default to 0, incremented upon each upload
  },
  main_image:{
    type:String
  },
  main_image_public_id:{
    type:String
  }
}, { timestamps: true });

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;
