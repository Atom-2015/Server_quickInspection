const mongoose = require('mongoose');

const ReportInsideSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Company',
      required: true,
    },
    issuetype:[ {
      type: String,
      
    }],
    inspaction: {
      inspactionname: {
        type: String,
        required: true,
      },
      componentname: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const ReportInside = mongoose.model('ReportInside', ReportInsideSchema);
module.exports = ReportInside;
