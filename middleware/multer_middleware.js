


const multer = require('multer');
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');   
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  
  } 
});

// Allow multiple images, max 10 images at a time.
const upload = multer({ storage }).array('images', 10);

// const upload = multer({ storage }).fields([
//   { name: 'image', maxCount: 1 }, // For single image upload with field name 'image'
//   { name: 'images', maxCount: 10 } // For multiple image uploads with field name 'images', up to 10 images
// ]);  


module.exports = upload;



