const mongoose = require('mongoose');
const Report = require('../models/reports/reports');
const ImageProcessed = require('../models/imageProcessed/imageProcessed');
const Company = require('../models/company/company');
const ImageCount = require('../models/imagecount/imagecount');
const extractPublicIdFromUrl = require('../utils/cloudinary_accessid')
const uploadOnCloudinary = require('../utils/cloudinary');
const deleteFromCloudinary = require('../utils/cloudinary_delete');
const fs = require('fs');
const Shapes = require('../models/imageProcessed/shapePositions');
const FastInspaction = require('../models/imageProcessed/fastInspaction');




// Report Createation Post API
module.exports.ReprtCreation = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);
    // return  res.status(200).json({ message: "Report Created Successfully" });



    // Check if data is present
    if (!data) {
      return res.status(400).json({ status: 400, user: false, message: 'Invalid data' });
    }

    const {
      inspaction_name,
      inspaction_company_owner,
      inspaction_type,
      display_coordinates_system
    } = req.body;

    // Check for empty fields
    if ([inspaction_name, inspaction_company_owner, inspaction_type].some(field => field?.trim() === "")) {
      return res.status(400).json({
        message: "Please provide full information"
      });
    }

    console.log(req.headers['x-company_id']);

    // Create the report
    const report = await Report.create({
      inspaction_name,
      inspaction_type,
      display_coordinates_system,
      inspaction_company_owner,
      user_email: req.user.email,
    });

    // Check if report was created
    if (!report) {
      return res.status(500).json({ status: 500, user: false, message: 'Report not created' });
    }

    return res.status(200).json({ status: 201, user: true, message: 'Report created successfully', data: report._id });

  } catch (error) {
    console.error("**************Error While Creating Report*************", error);
    return res.status(500).json({ status: 500, user: false, message: 'Internal server error' });
  }
};






// get api for report
module.exports.GetReport = async (req, res) => {
  console.log(req.user.email);

  try {

    const location = await Report.find({ user_email: req.user.email }).populate({
      path: 'image',
      select: 'latitude  longitude'
    })

    if (!location || location.length === 0) {
      return res.status(404).json({
        message: "No record found with  this email"
      })
    }
    // Iterate through each report and extract the latitude and longitude from the first image
    const report = location.map((report) => {
      const firstImage = report.image[0];  // Get the first image in the populated array
      return {
        ...report.toObject(),  // Convert the Mongoose document to a plain JS object
        latitude: firstImage ? firstImage.latitude : null,  // Get latitude from the first image
        longitude: firstImage ? firstImage.longitude : null  // Get longitude from the first image
      };
    });

    return res.status(200).json(report);
  } catch (error) {
    res.status(401).json({
      message: 'No data found'
    })
  }
}




// image count get api
module.exports.Imagecontroler = async (req, res) => {
  try {
    const companyId = req.headers['x-company_id'];

    // Fetch image count data for the specified company
    const imageCounts = await ImageCount.find({ companyid: companyId });

    if (!imageCounts || imageCounts.length === 0) {
      return res.status(404).json({ message: "No image count records found for this company" });
    }

    return res.status(200).json({ data: imageCounts });
  } catch (error) {
    console.error("Error fetching image count:", error);
    return res.status(500).json({ message: "Error fetching image count data" });
  }
};





// Image upload Post api
// module.exports.Handlecludinaryupload = async (req, res) => {
//   // console.log(req.files.length);
//   // return res.status(200)
//   const reportid = req.headers['x-report-id'];
//   const companyId = req.headers['x-company_id'];
//   console.log('Request Body:', req.body); // Log to verify latitude and longitude

//   console.log('Report ID:', reportid);
//   console.log('Company ID:', companyId);

//   if (!reportid || !companyId) { 
//     return res.status(400).json({
//       message: "Report Id or Company Id not provided"
//     });
//   }

//   let uploadedImages = []; // Array to store Cloudinary image URLs
//   let newImageProcessedDocs = []; // Array to store new ImageProcessed documents

//   try {
//     const report = await Report.findById(reportid);
//     if (!report) {
//       return res.status(400).json({
//         message: "Report not found"
//       });
//     }

//     // Check if files are uploaded
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         message: "No images uploaded, please try again"
//       });
//     }

//     // Get current date for month and year
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth(); // Returns 0 for January
//     const currentYear = currentDate.getFullYear();
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//     const monthName = months[currentMonth];  // Correctly map the current month to a name

//     // Process each image file
//     for (const file of req.files) {
//       const reportimagelocalpath = file.path;
//       console.log('Image Local Path:', reportimagelocalpath);

//       // Upload image to Cloudinary
//       const reportimage = await uploadOnCloudinary(reportimagelocalpath);
//       if (!reportimage) {
//         return res.status(400).json({
//           message: "Failed to upload image to Cloudinary"
//         });
//       }

//       uploadedImages.push(reportimage.url); // Save Cloudinary URL
//       const latitudeKey = 'latitude_0';
//       const longitudeKey = 'longitude_0';

//       const latitude = req.body[latitudeKey] && !isNaN(req.body[latitudeKey])
//         ? mongoose.Types.Decimal128.fromString(String(req.body[latitudeKey]))
//         : null;

//       const longitude = req.body[longitudeKey] && !isNaN(req.body[longitudeKey])
//         ? mongoose.Types.Decimal128.fromString(String(req.body[longitudeKey]))
//         : null;

//       // Log to verify correct values are being parsed
//       console.log('Parsed Latitude:', latitude);
//       console.log('Parsed Longitude:', longitude);

//       // Create new ImageProcessed document
//       const newImageProcessed = new ImageProcessed({
//         companyid: companyId,
//         image: reportimage.url,
//         latitude: latitude,
//         longitude: longitude,
//         month: monthName,
//         year: currentYear,
//         reportid: reportid,
//         imagelink: reportimage.url
//       });

//       await newImageProcessed.save();
//       newImageProcessedDocs.push(newImageProcessed._id);

//       // Update Report
//       report.image_on_cloudanary_uri.push(reportimage.url); // Add Cloudinary URL to report
//       report.image.push(newImageProcessed._id); // Add ImageProcessed reference
//       report.totalImagesProcessed = (report.totalImagesProcessed || 0) + 1;

//       // Delete the local image file after successful upload
//       fs.unlink(reportimagelocalpath, (err) => {
//         if (err) {
//           console.error(`Error removing file at ${reportimagelocalpath}:`, err);
//         } else {
//           console.log(`Successfully removed local file at ${reportimagelocalpath}`);
//         }
//       });
//     }

//     await report.save();

//     // Update or create ImageCount for the current month/year
//     let imageCount = await ImageCount.findOne({ companyid: companyId, month: monthName, year: currentYear });

//     if (!imageCount) {
//       // Create a new entry if none exists
//       imageCount = new ImageCount({
//         companyid: companyId,
//         month: monthName,
//         year: currentYear,
//         totalImagesProcessed: req.files.length
//       });
//     } else {
//       // Increment the count if an entry already exists
//       imageCount.totalImagesProcessed += req.files.length;
//     }

//     await imageCount.save();

//     return res.status(200).json({
//       status: 200,
//       message: "Images uploaded, report updated, and image count recorded successfully",
//       cloudinaryUrls: uploadedImages,
//       totalImagesProcessed: report.totalImagesProcessed
//     });

//   } catch (error) {
//     console.error("Error while uploading images:", error);

//     // Delete images from Cloudinary if error occurs
//     for (const image of uploadedImages) {
//       const publicId = extractPublicIdFromUrl(image);
//       if (publicId) {
//         await cloudinary.uploader.destroy(publicId);
//       }
//     }

//     return res.status(500).json({
//       status: 500,
//       message: 'Internal server error'
//     });
//   }
// };



 


// Function to upload file directly to Cloudinary

const uploadFileToCloudinary = async (buffer, fileName) => {
  try {
    if (!buffer) return null;

    // Upload file to Cloudinary using buffer (from memory)
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect file type (image, video, etc.)
          public_id: `uploads/${fileName}`, // Optionally specify a custom public ID
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          }
          resolve(result);
        }
      ).end(buffer); // Send the buffer directly to Cloudinary
    });
  } catch (error) {
    console.log('Error during Cloudinary upload:', error);
    return null;
  }
};

 





module.exports.HandleuploadImage = async (req, res) => {
  const reportid = req.headers['x-report-id'];
  const companyId = req.headers['x-company_id'];
  const userid = req.headers['x-auth-token'];

  if (!reportid || !companyId) {
    return res.status(400).json({
      message: "Report Id or Company Id not provided"
    });
  }

  console.log(req.body)

  if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
    return res.status(400).json({ 
      message: 'No images provided in the request' 
    });
  }

  try {
    const report = await Report.findById(reportid);
    if (!report) {
      return res.status(400).json({
        message: "Report not found"
      });
    }

    let uploadedImages = [];

    // let images = req.body;
 
    for (let i = 0; i <  req.body.images.length; i++) {
      const { url, latitude, longitude } =  req.body.images[i];

      if (!url) {
        return res.status(400).json({
          message: `Missing URL for image at index ${i}`
        });
      }

      const lat = latitude && !isNaN(latitude)
        ? mongoose.Types.Decimal128.fromString(String(latitude))
        : null;

      const long = longitude && !isNaN(longitude)
        ? mongoose.Types.Decimal128.fromString(String(longitude))
        : null;

      const newImageProcessed = new ImageProcessed({
        companyid: companyId,
        image: url,
        latitude: lat ,
        longitude: long ,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        reportid: reportid,
        imagelink: url
      });

      await newImageProcessed.save();

      uploadedImages.push({
        url,
        latitude: lat,
        longitude: long
      });

      report.image_on_cloudanary_uri.push(url);
      report.image.push(newImageProcessed._id);
      report.totalImagesProcessed = (report.totalImagesProcessed || 0) + 1;
    }

    await report.save();

    let imageCount = await ImageCount.findOne({
      companyid: companyId,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear()
    });

    if (!imageCount) {
      imageCount = new ImageCount({
        companyid: companyId,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        totalImagesProcessed: req.body.images.length
      });
    } else {
      imageCount.totalImagesProcessed += req.body.images.length;
    }

    await imageCount.save();

    return res.status(200).json({
      status: 200,
      message: "Images uploaded, report updated, and image count recorded successfully",
      cloudinaryUrls: uploadedImages, // Array of uploaded images with metadata
      totalImagesProcessed: report.totalImagesProcessed
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
};









// ******** Api to retrive image uri of cloudinary ************* //
module.exports.HandleDisplayCloudinaryImageUi = async (req, res) => {
  if (!req.headers['x-report-id']) {
    return res.status(401).json({ message: 'report id is required' });
  }

  try {
    const reportId = req.headers['x-report-id'];
    const report = await Report.findOne({ _id: reportId }).populate({
      path: 'image',
      model: 'ImageProcessed',
      select: 'latitude longitude isCompleted image'
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    const processedImages = await Promise.all(
      report.image.map(async (img) => {
        const shapes = await Shapes.findOne({ imageProcessedid: img._id });
        const fast = await FastInspaction.findOne({imageProcessedid:img._id });
        const rectangles = shapes ? shapes.rectangles : [];
        const polygons = shapes ? shapes.polygons : [];
        const fastInspaction = fast ? fast.shape : [];

        return {
          _id: img._id,
          latitude: img.latitude,
          longitude: img.longitude,
          isCompleted: rectangles.length > 0 || polygons.length > 0,
          shapes: {
            rectangles,
            polygons,
            fastInspaction
          }
        };
      })
    );

    // Extract image URLs for `image_on_cloudanary_uri` field
    const imageOnCloudinaryUri = report.image.map(img => img.image).flat();
    const responseData = {
      _id: report._id,
      inspaction_name: report.inspaction_name,
      inspaction_type: report.inspaction_type,
      display_coordinates_system: report.display_coordinates_system,
      inspaction_company_owner: report.inspaction_company_owner,
      user_email: report.user_email,
      image: processedImages, // Include processed images with shape data
      image_on_cloudanary_uri: imageOnCloudinaryUri, // Array of Cloudinary URIs
      totalImagesProcessed: processedImages.length,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      __v: report.__v
    };

    return res.status(200).json({
      data: [responseData],
      message: 'Data extracted successfully'
    });
  } catch (error) {
    console.error('Error in fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





//   ********* Get Api for the data of serched company ***************
module.exports.HandleSearchedCompany = async (req, res) => {
  const { companyname } = req.body;
  if (!companyname || companyname.trim() === '') {
    return res.status(401).json({ message: 'Company name is required' });
  }
  try {
    const regex = new RegExp(companyname.trim(), 'i');


    const report = await Report.find({ inspaction_company_owner: { $regex: regex } });
    if (!report || report.length === 0) {
      return res.status(403).json({
        message: 'No report for searched company'
      });
    }
    return res.status(200).json({
      message: "Searched data found",
      data: report
    });

  } catch (error) {
    console.log(`Error in extracting data from db in handlesearchcompany controller: ${error}`);
    res.status(404).json({
      message: "Something went wrong"
    });
  }
};



// ****** Api to find report by report name
module.exports.HandleSearchbyReportName = async (req, res) => {
  if (!req.query.param1) {
    return res.status(401).json({
      message: "Havent recived Param"
    })
  }
  try {
    const ReportName = req.query.param1;
    const regex = new RegExp(ReportName.trim(), 'i');

    const report2 = await Report.find(
      {
        $or: [
          { inspaction_name: { $regex: regex } },
          { inspaction_company_owner: { $regex: regex } }
        ]
      }
    )
    if (!report2 || report2.length === 0) {
      return res.status(403).json({
        message: 'No report for searched report'
      })
    }
    return res.status(200).json({
      message: "Data extracted",
      data: report2
    })


  } catch (error) {

    console.log(error)
    return res.status(404).json({ message: "Internal Server Error" })
  }
}




// Api to update the Image on cloud 
module.exports.HandleUpdatingCloudinaryImage = async (req, res) => {
  const { reportid, index, component, issue_type, severity, remedy_action, repair_cost, comment, shapename, shape } = req.body;
  const imageProcessedId = req.headers['imageprocessed_id'];
  const report_id = req.headers['x-report-id'];

  console.log('Received data:', req.body);

  // Validate required fields
  if ([reportid, index, component, issue_type].some(field => !field || typeof field !== 'string' || field.trim() === "")) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the existing shape document or create a new one
    let response = await Shapes.findOne({ reportId: report_id, imageProcessedid: imageProcessedId });
    if (!response) {
      response = new Shapes({
        reportId: report_id,
        imageProcessedid: imageProcessedId,
        rectangles: [],
        polygons: []
      });
    }

    // Parse the shape data if it is a string
    const shapeData = typeof shape === 'string' ? JSON.parse(shape) : shape;

    // Update shape based on type
    if (shapename === 'rectangle' && shapeData) {
      response.rectangles.push({
        issue:issue_type,
        x: shapeData.x,
        y: shapeData.y,
        width: shapeData.width,
        height: shapeData.height
      });
    } else if (shapename === 'polygon' && shapeData) {
      const points = [];
      for (let i = 0; i < shapeData.length; i += 2) {
        points.push({ x: shapeData[i], y: shapeData[i + 1] });
      }
      response.polygons.push({ points });
    }

    // Save the updated shape document
    await response.save();

    // Find and update or create the ImageProcessed document
    let imagedatatobepushed = await ImageProcessed.findById(imageProcessedId);
    if (!imagedatatobepushed) {
      return res.status(403).json({ message: "No Data Found" });
    }

    imagedatatobepushed.isCompleted = true;
    imagedatatobepushed.reportdetail.push({
      component: component,
      Issuetype: issue_type,
      severity: severity || "",
      remedy_action: remedy_action || "",
      repair_cost: repair_cost || "",
      comment: comment || "",
    });

    let saveResult = await imagedatatobepushed.save();

    console.log('Report details saved successfully');
    return res.status(200).json({
      message: 'Image and report details successfully updated',
      newImageUrl: saveResult.image ? saveResult.image[0] : null,
      data: saveResult
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// Get Api to show Image details
module.exports.HandleReportDetail = async (req, res) => {
  const image_id = req.headers['image-id'];
  // const imageProcessedId = req.headers['image-id'];

  // Validate the IDs
  if (!image_id) {
    return res.status(400).json({ message: 'Image ID or ImageProcessed ID is missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(image_id)) {
    return res.status(400).json({ message: 'Invalid Image ID or ImageProcessed ID' });
  }

  try {
 
    const report = await ImageProcessed.findById(image_id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    const fastInspaction = await FastInspaction.findOne({imageProcessedid:image_id});
    const shape = await Shapes.findOne({ imageProcessedid: image_id });
    return res.status(200).json({
      message: 'Data found',
      reportData: report,
      shapeData: shape || "No Shape",
      fastInspaction:fastInspaction || "No Fast Inspaction"
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};





// Get API for Perticular Report Detail
module.exports.HandleReportDetailById = async (req, res) => { 
  const report_id = req.query.param1;
  if (!report_id) {
    return res.status(403).json({
      message: 'No Report Id found'
    })
  }


  try {
    const report = await Report.findById(report_id);
    if (!report) return res.status(403).json({ message: 'No detail found' })
    return res.status(200).json({
      message: 'Data Found',
      data: report
    })
  } catch (error) {
    return res.status(404).json({
      message: 'Internal Sercer Error'
    })
  }
}





// Api to show the data of report !!!!!!1
 
module.exports.HandleimageandDatainPdf = async (req, res) => {
  const reportId = req.headers['x-report-id'];
  console.log(reportId);

  if (!reportId) return res.status(401).json({ message: "No Report Id found" });

  try {
    let report = await Report.findById(reportId).populate('image').exec();

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const mainImageUrl = report.main_image;

    const shapeimagedata = await Shapes.find({ reportId });
    const fastdata = await FastInspaction.find({ reportid: reportId });

    if (!fastdata.length) console.log("No Data in Fast Inspection");

    // Map Shapes data by imageProcessedid
    const shapeDataMap = shapeimagedata.reduce((map, shape) => {
      map[shape.imageProcessedid] = {
        rectangles: shape.rectangles,
        polygons: shape.polygons,
      };
      return map;
    }, {});

    // Map FastInspection data by imageProcessedid
    const fastDataMap = fastdata.reduce((map, fast) => {
      if (!map[fast.imageProcessedid]) {
        map[fast.imageProcessedid] = [];
      }
      // Push each shape into the corresponding imageProcessedid
      fast.shape.forEach((shape) => {
        map[fast.imageProcessedid].push({
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
        });
      });
      return map;
    }, {});

    // Combine Shapes and FastInspection data with images
    const filteredData = report.image.map((img) => {
      return {
        imageUrl: img.image[0],
        imageid: img._id,
        reportDetails: img.reportdetail.map((detail) => ({
          component: detail.component,
          Issuetype: detail.Issuetype,
          severity: detail.severity,
          remedy_action: detail.remedy_action,
          repair_cost: detail.repair_cost,
          comment: detail.comment,
        })),
        shapes: shapeDataMap[img._id] || { rectangles: [], polygons: [] },
        fastInspection: fastDataMap[img._id] || [], // Include FastInspection data
      };
    });

    return res.status(200).json({
      message: "Hitted",
      data: {
        main_image: mainImageUrl,
        images: filteredData,
      },
    });
  } catch (error) {
    console.log('Error in pdf data:', error);
    return res.status(500).json({ message: "No data" });
  }
};




// Get api to fetch data via name
module.exports.HandleReportNameOnly = async (req, res) => {
  if (!req.headers['x-report-id']) {
    return res.status(403).json({
      message: "No  report id provided",
    })
  }
  try {
    let report = await Report.findById(req.headers['x-report-id']).select(" inspaction_name inspaction_company_owner ");
    if (!report) {
      return res.status(403).json({
        message: "No report found",
      });
    }
    // const report = {
    //   inspaction_name:report.inspaction_name,
    //   inspaction_company : inspaction_company_owner
    // }
    return res.status(200).json({
      message: "Hitted",
      data: report

    })

  } catch (error) {
    return res.status(403).json({
      message: "Internal Server Error",
    })
  }
}




//************* Delete API for Report ************/
module.exports.HandleDeleteReport = async (req, res) => {
  const reportId = req.headers['x-report-id'];

  if (!reportId) {
    return res.status(400).json({
      message: "No Report Id Found"
    });
  }
  console.log(reportId)
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        message: "Report Not Found"
      });
    }

    const deleteFromCloud = report.image_on_cloudanary_uri;

    // Ensure all deletions are awaited
    const deleteImgPromises = deleteFromCloud.map(async (img) => {
      const accessId = extractPublicIdFromUrl(img);
      return await deleteFromCloudinary(accessId);
    });

    const deleteResults = await Promise.all(deleteImgPromises); 

    if (deleteResults.includes(false)) { // Assuming deleteFromCloudinary returns true/false
      return res.status(403).json({
        message: "Error While Deleting From Cloud"
      });
    }

    const imagedelete = await ImageProcessed.deleteMany({ reportid: reportId });
    // if (imagedelete.deletedCount === 0) {
    //   return res.status(403).json({
    //     message: "Error While Deleting Image"
    //   });
    // }

    await report.deleteOne({ _id: reportId });

    const finalCheck = await Report.findById(reportId);
    if (finalCheck) {
      return res.status(403).json({
        message: "Error While Deleting Report, Please Try Later"
      });
    }

    return res.status(200).json({
      message: "Report Deleted Successfully"
    });

  } catch (error) {
    console.error("Error deleting report:", error); // Log the error for debugging
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};




// ************* API to Update the data of ************ //  
module.exports.HandleUpdateOfReportDetail = async (req, res) => {
  const reportId = req.headers['x-report-id']; // Get report ID from headers

  // Validate that the report ID is provided
  if (!reportId) {
    return res.status(403).json({ message: "Report ID is required" });
  }

  const { inspaction_name, inspaction_type, display_coordinates_system } = req.body;

  // Validate that all required fields are provided and not empty
  if ([inspaction_name, inspaction_type, display_coordinates_system].some(field => !field?.trim())) {
    return res.status(403).json({ message: "All fields are required" });
  }

  try {
    // Use updateOne to update a single report based on report ID
    const response = await Report.findByIdAndUpdate(
      { _id: reportId }, // Filter by report_id
      { $set: { inspaction_name, inspaction_type, display_coordinates_system } } // Update these fields
    );

    // Check if the report was found and updated
    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "No matching report found" });
    }

    if (response.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes were made" });
    }

    return res.status(200).json({ message: "Report updated successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




//Api to extract data of image  from the database
module.exports.HandleImagesInPerticularReport = async (req, res) => {
  if (!req.headers['x-report-id']) {
    return res.status(401).json({ message: 'Report ID is required' });
  }
  try {
    // const report = await ImageProcessed.find({ reportid: '66eb9a80a1650a4043a6db1e' });
    const report = await ImageProcessed.find({ reportid: req.headers['x-report-id'] });
    // console.log('Report Data:', report); // Debugging
    if (!report || report.length === 0) {
      return res.status(404).json({ message: 'No image data found' });
    }
    const data = report.map((val) => ({
      _id: val.id,
      imageLink: val.imagelink || null,  
      updatedAt: val.updatedAt || null,
      reportdetail: val.reportdetail || null,
      tags: val.tags || "No Tags"
    }))
    return res.status(200).json({
      data: data,
      message: 'Data extracted successfully',
    });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};







// APi to delete shape or issue from the report 
module.exports.HandleDeleteShapefromimage = async (req, res) => {
  const issueid = req.headers['x-issue-id'];
  const reportdetailid = req.headers['x-reportdetail-id'];
  const shapeId = req.headers['x-shape-id'];
  const objectId = req.headers['x-object-id'];
  const updateShape = req.headers['x-update-shapename']; 

  if (!shapeId || !objectId || !updateShape) {
    return res.status(403).json({ message: "Missing Data" });
  }
  try {
    if (issueid && reportdetailid) {
      const imageProcessUpdate = await ImageProcessed.findByIdAndUpdate(
        issueid,
        { $pull: { reportdetail: { _id: reportdetailid } } }
      );
      if (!imageProcessUpdate) {
        return res.status(404).json({ message: "No matching report detail found" });
      }
    }
    let shapeDelete;
    if (updateShape.toLowerCase() === 'rectangle') {
      shapeDelete = await Shapes.updateOne(
        { _id: shapeId },
        { $pull: { rectangles: { _id: objectId } } }
      );
      const updatedShape = await Shapes.findById(shapeId);
      if (updatedShape && updatedShape.rectangles.length === 0 && updatedShape.polygons.length === 0) {
        await Shapes.findByIdAndDelete(shapeId);
        return res.status(200).json({ message: "Rectangle deleted, and shape document removed as it was empty" });
      }

      if (shapeDelete.modifiedCount > 0) {
        return res.status(200).json({ message: "Rectangle object deleted successfully" });
      } else {
        return res.status(404).json({ message: "No matching rectangle object found" });
      }
    } else if (updateShape.toLowerCase() === 'polygon') {
      shapeDelete = await Shapes.updateOne(
        { _id: shapeId },
        { $pull: { polygons: { _id: objectId } } }
      );

      const updatedShape = await Shapes.findById(shapeId);
      if (updatedShape && updatedShape.rectangles.length === 0 && updatedShape.polygons.length === 0) {
        await Shapes.findByIdAndDelete(shapeId);
        return res.status(200).json({ message: "Polygon deleted, and shape document removed as it was empty" });
      }

      if (shapeDelete.modifiedCount > 0) {
        return res.status(200).json({ message: "Polygon object deleted successfully" });
      } else {
        return res.status(404).json({ message: "No matching polygon object found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid shape type specified" });
    }
  } catch (error) {
    console.error("Error in HandleDeleteShapefromimage:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




// Api to Edit Issues which were created in the image
module.exports.HandleUpdateImageIssue = async (req, res) => {
  const { Component, Issue_Type, Severity, Remedy_Action, Repair_Cost, Comment } = req.body;
  const imageprocessed_id = req.headers['x-imagep-id'];
  const reportdetailIndex = req.headers['x-reportdetail-index'];  
  console.log(imageprocessed_id);
  console.log(reportdetailIndex);


  try { 
    const imageupdate = await ImageProcessed.findById(imageprocessed_id);

    if (!imageupdate || !imageupdate.reportdetail[reportdetailIndex]) {
      return res.status(404).json({ message: "Image or report detail not found" });
    }  
    imageupdate.reportdetail[reportdetailIndex] = {
      component: Component,
      Issuetype: Issue_Type,
      severity: Severity,
      remedy_action: Remedy_Action,
      repair_cost: Repair_Cost,
      comment: Comment,
    }; 
    const savedImageUpdate = await imageupdate.save();

    if (savedImageUpdate) {
      return res.status(200).json({
        message: "Data updated successfully",
        data: savedImageUpdate,
      });
    } else {
      return res.status(500).json({
        message: "Failed to save updated data",
      });
    }

  } catch (error) {
    console.error("Error in HandleUpdateImageIssue:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};





// Api to Store the data of fast inspaction

// module.exports.HandleFastInspaction = async(req , res) => {
//   const {component , Issuetype , severity , remedy_action , repair_cost , comment } = req.body;
//   const ImageProcessedid = req.headers['x-image-id'];
//    if([req.body.fastInspaction].some(field => !field || field.length === 0 || typeof field !== 'Array')) {
//     return res.status(403).json({
//       message:"Enter Valid Data for Shape"
//     })
//    }
//   if( [component , Issuetype].some(field => !field || typeof field !== 'string' ||  !field?.trim()==='' ) ){
//     return res.status(403).json({
//       message:"Enter Valid Data"
//     })
//   }
//   try {
//     const response = ImageProcessed.findById({ImageProcessedid});
//     if (!response) {
//       return res.status(403).json({
//         message:"Image Data Not Found"
//       })
//     }
//     await response.reportdetail.push({
//       component: component,
//       Issuetype: Issuetype,
//       severity: severity || "",
//       remedy_action: remedy_action || "",
//       repair_cost: repair_cost || "",
//       comment: comment || "",
//     });
//     response.isCompleted = true;
//     await response.save();

//     const shapesave = FastInspaction.findOne({
//       imageProcessedid:ImageProcessedid
//     })
//     if(!shapesave){
//       await shapesave.create({
//         imageProcessedid:ImageProcessedid,
//         shape:req.body.fastInspaction
//       })
//       await shapesave.save();
//       return res.status(201).json({
//         message:"Shape Saved"
//       })
//     }
//     shapesave.shape.push(
//       req.body.fastInspaction
//     )
//     await shapesave.save();

//     return res.status(200).json({
//       message:"Shape Saved",
//       data:shapesave
//     })
    

//   } catch (error) {
//     return res.status(403).json({
//       message:"Internal Server Error"
//     })
//   }

// };




module.exports.HandleFastInspaction = async (req, res) => {
  // const { component, Issuetype, severity, remedy_action, repair_cost, comment } = req.body.fastInspactionDataall;
  const { fastInspaction , component} = req.body;
  console.log(fastInspaction , "" , component , "image id:" , req.headers['x-image-id'] ); 
  console.log(req.headers['x-report-id']);
  const ImageProcessedid = req.headers['x-image-id'];
  if(!ImageProcessedid || !req.headers['x-report-id']) return res.status(403).json({message:"Missing Data"})

    

  if (!Array.isArray(req.body.fastInspaction) || req.body.fastInspaction.length === 0) {
    return res.status(400).json({
      message: "Enter valid data for Shape"
    });
  } 
  const isValidShapes = req.body.fastInspaction.every((shape) =>
    shape.x !== undefined && shape.y !== undefined && shape.width === 50 && shape.height === 50
  );  

  if (!isValidShapes) {
    return res.status(400).json({
      message: "Invalid shape data structure: each shape should have x, y, width, and height as 50."
    });
  }

  if ([component.component, component.Issuetype].some(field => !field || typeof field !== 'string' || field.trim() === '')) {
    return res.status(400).json({
      message: "Enter valid data for component and issue type"
    });
  }

  try { 
    const response = await ImageProcessed.findById(ImageProcessedid);
    if (!response) {
      return res.status(404).json({
        message: "Image data not found"
      });
    }
 
    response.reportdetail.push({
      component:component.component,
      Issuetype: component.Issuetype,
    });
    response.isCompleted = true;
    await response.save();
 
    let shapesave = await FastInspaction.findOne({ imageProcessedid: ImageProcessedid });
    if (!shapesave) {
      shapesave = new FastInspaction({
        imageProcessedid: ImageProcessedid,
        reportid:req.headers['x-report-id'],
        shape: req.body.fastInspaction.flat()
      });
    } else {
      shapesave.shape.push(...req.body.fastInspaction.flat());
    }
    await shapesave.save();

    return res.status(200).json({
      message: "Shape saved",
      data: shapesave
    });
  } catch (error) {
    console.error("Error in HandleFastInspaction:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};





// API to delete the data the image 

module.exports.HandleDeleteImage = async (req, res) => {
  const reportid = req.headers['x-report-id'];
  const imageProcessedid = req.headers['x-image-id']; // Use consistent naming
  const index = parseInt(req.query.index); // Parse index as an integer

  if (!imageProcessedid || !reportid) {
    return res.status(400).json({
      message: "Image id and report id are required",
    });
  }

  try {
    // Delete ImageProcessed entry
    const response = await ImageProcessed.findByIdAndDelete(imageProcessedid);
    if (!response) {
      return res.status(403).json({ message: "No image found" });
    }

    // Update the report
    const report = await Report.findById(reportid);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (index >= 0 && index < report.image_on_cloudanary_uri.length) {
      report.image_on_cloudanary_uri.splice(index, 1); // Remove from `image_on_cloudanary_uri`
      if (index >= 0 && index < report.image.length) {
        report.image.splice(index, 1); // Remove from `image`
      }
    } else {
      return res.status(400).json({ message: "Index out of bounds" });
    }

    await report.save();

    // Handle FastInspaction deletion (optional, only if exists)
    const fastInspaction = await FastInspaction.findOneAndDelete({ imageProcessedid });
    if (!fastInspaction) {
      console.log("No fast inspection data found for this image.");
    }

    // Handle Shapes deletion (optional, only if exists)
    const shapedata = await Shapes.findOneAndDelete({ imageProcessedid });
    if (!shapedata) {
      console.log("No shape data found for this image.");
    }

    return res.status(200).json({
      message: "Image deleted successfully",
      fastInspaction: fastInspaction || null, // Include fast inspection data if it exists
      shapedata: shapedata || null, // Include shape data if it exists
    });

  } catch (error) {
    console.error("Error in HandleDeleteImage:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};






module.exports.HandleAiData = async (req, res) => {
  // Validate headers
  if (!req.headers['reportId'] || !req.headers['imageId']) {
    return res.status(400).json({ message: "Missing reportId or imageId in headers" });
  }

  const { inspection_name, category, rectangles } = req.body;

  // Validate required fields in the request body
  if ([inspection_name, category].some(field => field?.trim() === "")) {
    return res.status(400).json({
      message: "Please provide full information"
    });
  }

  if (!rectangles || !Array.isArray(rectangles)) {
    return res.status(400).json({ 
      message: 'No Data set Provided' 
    });
  }

  try {
    // Fetch or create the Shapes document based on the reportId and imageProcessedId
    let response = await Shapes.findOne({
      reportId: req.headers['reportId'],
      imageProcessedid: req.headers['imageId']
    });

    if (!response) {
      // Create a new Shapes document if not found
      response = new Shapes({
        reportId: req.headers['reportId'],
        imageProcessedid: req.headers['imageId'],
        inspection_name: inspection_name,
        category: category,
        rectangles: []
      });
    }

    // Add the rectangles data to the response
    rectangles.forEach(shapeData => {
      response.rectangles.push({
        class: shapeData.class || "unknown",  // Default to 'unknown' if class is missing
        x: shapeData.x,
        y: shapeData.y,
        width: shapeData.width,
        height: shapeData.height
      });
    });

    // Save the updated shape document
    await response.save();

    // Return the response in the requested JSON format
    return res.status(200).json({
      "_id": response._id,
      "reportId": response.reportId,
      "imageProcessedId": response.imageProcessedid,
      "inspection_name": response.inspection_name,
      "category": response.category,
      "image_name": response.image_name || "Not Provided", // Assuming image_name is optional
      "rectangles": response.rectangles,
      "createdAt": response.createdAt,
      "updatedAt": response.updatedAt
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};










