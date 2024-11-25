const multer = require('multer');

// Use memory storage so the file is not written to disk but kept in memory
const uploadpdf = multer({ storage: multer.memoryStorage() });

module.exports = uploadpdf;
