const mongoose = require('mongoose');

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ImageProcessedSchema = new mongoose.Schema({
  companyid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Company',
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: months, 
  },
  year: {       
    type: Number,
    required: true,
  },
  totalImagesProcessed: {
    type: Number,
    required: true,
    default: 0,
  },
  image: [{
    type: String,
  }],
  latitude:{
    type: mongoose.Schema.Types.Decimal128,
  },
  longitude:{
    type: mongoose.Schema.Types.Decimal128,
  },
  tags:[{
    type: String
  }],
  reportdetail:[
    {
      component: { type: String },
      Issuetype: { type: String },
      severity: { type: Number },
      remedy_action: { type: String },
      repair_cost: { type: Number },
      comment: { type: String }
    }
  ],
  reportid:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Report',
  },
  imagelink:{
    type: String
  },
  isCompleted:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

ImageProcessedSchema.pre('save', function(next) {

  if (typeof this.month === 'number' && this.month >= 1 && this.month <= 12) {
    this.month = months[this.month - 1]; 
  }
  next();
});

ImageProcessedSchema.pre('save', function (next) {
  if (!this.latitude || !this.longitude) {
    this.latitude = mongoose.Types.Decimal128.fromString('0.0');
    this.longitude = mongoose.Types.Decimal128.fromString('0.0');
  }
  next();
});




const ImageProcessed = mongoose.model('ImageProcessed', ImageProcessedSchema);
module.exports = ImageProcessed;
