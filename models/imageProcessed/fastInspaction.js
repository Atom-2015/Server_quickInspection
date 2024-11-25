const mongoose = require('mongoose');


const fastInspactionSchema = new mongoose.Schema({
    imageProcessedid:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'ImageProcessed',
        require:true
    },
    reportid:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'Report',
    },
    shape:[
        {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
            width: { type: Number, enum:50  , require:true},
            height: { type: Number, enum:50 , require:true},
          }
    ]
},{ timestamps: true });

const FastInspaction = mongoose.model('FastInspaction', fastInspactionSchema);

module.exports = FastInspaction;