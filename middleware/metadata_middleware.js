import fs from 'fs';
import exifParser from 'exif-parser';


export const extractExifData = (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  try {
    const buffer = fs.readFileSync(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();


    if (result.tags.GPSLatitude && result.tags.GPSLongitude) {
      req.imageMetaData = {
        latitude: result.tags.GPSLatitude,
        longitude: result.tags.GPSLongitude
      };
    } else {
      req.imageMetaData = null;  
    }

    next(); 
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return res.status(500).send('Error processing image metadata.');
  } finally {
    fs.unlinkSync(filePath); 
  }
};
