const mongoose = require('mongoose');

const ShapesPositionSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Report',
    required: true,
  },
  imageProcessedid:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'ImageProcessed',
  },
  rectangles: [
    {
      issue:{type:String },
      x: { type: Number, required: true },  // Starting x position
      y: { type: Number, required: true },  // Starting y position
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    }
  ],
  polygons: [
    {
      issue: [
        {
          class:{type:String},
          x: { type: Number, required: true },
          y: { type: Number, required: true }
        }
      ]
    }
  ]
}, { timestamps: true });

const Shapes = mongoose.model('Shapes', ShapesPositionSchema);
module.exports = Shapes;
