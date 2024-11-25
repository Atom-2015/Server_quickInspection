const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;  // Use v2 directly for consistency
const Report = require('../models/reports/reports');
const ExeSummry = require('../models/report_inside/executive_summary')

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.HandlemainImage = async (req, res) => { 
  // Check if the file and report ID are present
  if (!req.file || !req.headers['x-report-id']) {
    return res.status(400).json({ message: "No image or Report ID found" });
  }
  if(!req.headers['x-report-id']) return res.status(400).json({ message: "No  Report ID found" });

  try {
    // Find the report by ID
    let report = await Report.findById(req.headers['x-report-id']);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // If there's an existing image, delete it from Cloudinary
    if (report.main_image_public_id) {
      const deleteResponse = await cloudinary.uploader.destroy(report.main_image_public_id);
      if (deleteResponse.result !== 'ok') {
        console.log(`Unable to delete image from Cloudinary: ${report.main_image_public_id}`);
      }
    }

    // Upload the new image to Cloudinary using a buffer
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },  // Ensure it's set to image
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(req.file.buffer);  // Pass the buffer to Cloudinary stream
    });

    if (!uploadResponse) {
      return res.status(500).json({ message: "Image upload to Cloudinary failed" });
    }

    // Update the report with the new image details
    report.main_image = uploadResponse.url;
    report.main_image_public_id = uploadResponse.public_id;
    await report.save();

    // Return the successful response
    return res.status(200).json({
      message: "Image uploaded successfully",
      url: uploadResponse.url,  // Corrected response variable
      public_id: uploadResponse.public_id
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};





//Api to Store the data of Executive summry 
// ***************** Api Not tested as on 10/28/20243******************
// module.exports.HandleStoreExcSummry = async (req , res)=>{
//   if(!req.headers['x-reportid']){
//     return res.status(403).json({
//       message:"Report Id not present"
//     })
//   }
//   const {summrydata} = req.body;
//   if([summrydata].some(item => !item || item==="")){
//     return res.status(402).json({
//       message:"Data Missing"
//     })
//   }

//   try {
//     const response = await ExeSummry.find({reportid:req.headers['x-reportid']});
//     if(response){
//       response.executive_summary = summrydata;
//       await response.save();
//       return res.status(200).json({
//         message: "Summary Updated"
//       });
//     }
//     const response2 = await ExeSummry.create({    
//       reportid:req.headers['x-reportid'],
//       executive_summary:summrydata
//     })
//     if(!response2){
//       return res.status(402).json({
//         message:"Summry Not Created"
//       })
//     }
//     return res.status(200).json({
//       message:"Summry Created"
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(404).json({
//       message:"Internal Server Error"
//     })
//   }
// }
module.exports.HandleStoreExcSummry = async (req, res) => {
  // Check if report ID is present in headers
  if (!req.headers['x-reportid']) {
    return res.status(403).json({
      message: "Report Id not present"
    });
  }

  const { summrydata } = req.body;

  // Check if summrydata is present and valid
  if (!summrydata || summrydata === "") {
    return res.status(400).json({
      message: "Data Missing"
    });
  }

  try {
    // Find existing summary by report ID
    const existingSummary = await ExeSummry.findOne({ reportid: req.headers['x-reportid'] });

    if (existingSummary) {
      // Update existing summary if found
      existingSummary.executive_summary = summrydata;
      await existingSummary.save();
      return res.status(200).json({
        message: "Summary Updated"
      });
    } else {
      // Create new summary if not found
      const newSummary = await ExeSummry.create({
        reportid: req.headers['x-reportid'],
        executive_summary: summrydata
      });
      
      return res.status(201).json({
        message: "Summary Created",
        data: newSummary // Optionally return the created summary data
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};




// Api to Get the data of Executive summary
module.exports.HandleGetSummary = async(req , res)=>{
  if(!req.headers['x-report-id']){
    return res.status(403).json({
      message:"Report id is missing"
    }) 
  }
  try {
    const summary = await ExeSummry.findOne({reportid:req.headers['x-report-id']}).select("  executive_summary ");
    if(!summary){
      return res.status(402).json({
        message:"No summery present in perticular Report"
      })
    }
    return res.status(200).json({
      message:"Data Found",
      data:summary
    })
  } catch (error) {
    return res.status(404).json({
      message:"Internal Server Error"
    })
  }
}
