// const v2 = require('cloudinary');
// const cloudinary = require('cloudinary')
// const fs = require('fs')


// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key:  process.env.CLOUDINARY_API_KEY, 
//     api_secret:  process.env.CLOUDINARY_API_SECRET
// });


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })

//         if(response.status != 200){
//             console.log(response.message);
//         }
        
//         // file has been uploaded successfull
//         console.log("file is uploaded on cloudinary ", response.url); //will remove url and see what all things we would be gettig 
//         fs.unlinkSync(localFilePath)
//         return response;

//     } catch (error) {
//         console.log(error)
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }



// // export {uploadOnCloudinary}

// module.exports = uploadOnCloudinary;



const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (fileBuffer, fileName) => {
  try {
    const response = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", public_id: fileName },
      (error, result) => {
        if (error) {
          console.log('Cloudinary upload failed:', error);
          return null;
        }
        console.log('File uploaded successfully:', result.url);
        return result;
      }
    );
    // Pipe the file buffer to Cloudinary upload stream
    response.end(fileBuffer);
  } catch (error) {
    console.log('Error uploading to Cloudinary:', error);
    return null;
  }
};

module.exports = uploadOnCloudinary;





