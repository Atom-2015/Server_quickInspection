const mongoose = require('mongoose');

const TagImageSchema = new mongoose.Schema({
    reportid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: true // Ensures report ID is present
    },
    maintag: [
        {
            taggroup: {
                type: String,
                required: true // Ensures each tag group has a name
            },
            tags: [
                {
                    type: String // We'll add tags via a separate API
                }
            ]
        }
    ]
}, { timestamps: true });

const TagImage = mongoose.model('TagImage', TagImageSchema);
module.exports = TagImage;
