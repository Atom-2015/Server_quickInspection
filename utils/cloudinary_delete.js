const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Delete function
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        const response = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from Cloudinary:", response);
        return response;
    } catch (error) {
        console.log('Error during deletion:', error);
        return null;
    }
};

// module.exports = {deleteFromCloudinary };

module.exports = deleteFromCloudinary;