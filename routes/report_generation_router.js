const express = require('express');
const router = express.Router();
const ReportControler =  require('../controler/Report_Controler');
const PdfStorage = require('../controler/Generate_Pdf')
const isAuthenticated = require('../middleware/isAuth_middleware');
const  upload  = require('../middleware/multer_middleware');
const uploadone = require('../middleware/multer_middleware1img');
const uploadpdf =  require('../middleware/multerReport');
const Generate_Pdf = require('../controler/Generate_Pdf')
 


router.post('/create', isAuthenticated , ReportControler.ReprtCreation);

//To get  all reports in listing page
router.get('/listing', isAuthenticated, ReportControler.GetReport);


//Count of images 

router.get('/imagecount' , isAuthenticated, ReportControler.Imagecontroler);

//Add image in report
// router.post('/addimage', upload, ReportControler.Handlecludinaryupload);

router.post('/addimage', ReportControler.HandleuploadImage);

// router.post('/addimage' , (req , res)=>{
//     return res.status(200).json({
//         message:"hello"
//     })
// })

// router.post('/upload', upload.array('files'), async (req, res) => {
//     console.log(req.files); // Should now contain files
//     // Handle the upload logic here
//   });


// *******Router for all images on cloudinary **********
router.get('/cloudimage' , isAuthenticated , ReportControler.HandleDisplayCloudinaryImageUi);



//***********Route for search by company *************/
router.post('/searchCompany' , isAuthenticated ,  ReportControler.HandleSearchedCompany);


// Get api for report by inspaction name
router.get('/searchinspaction' , isAuthenticated , ReportControler.HandleSearchbyReportName);


//POST Api for uploading updated image 
router.post('/updateimage' , isAuthenticated ,uploadone , ReportControler.HandleUpdatingCloudinaryImage)



router.get('/reportdetail' , isAuthenticated , ReportControler.HandleReportDetail);


//Get API for perticular detail  of report
router.get('/onereport' , isAuthenticated , ReportControler.HandleReportDetailById);


router.get('/getpdfdata' , isAuthenticated , ReportControler.HandleimageandDatainPdf);


// *******************Api to store image of  report in PDF *******************
router.post('/storepdfimg' , isAuthenticated ,  uploadpdf.single('image') , PdfStorage.HandlemainImage );


//*******************Api to detch just name of Report******************/
router.get('/getreportname' , isAuthenticated , ReportControler.HandleReportNameOnly);


// ******************* API to delete Report Data *******************
router.delete('/deletereport', isAuthenticated, ReportControler.HandleDeleteReport);



// Update api to update the report data
router.put('/updatedata' , isAuthenticated , ReportControler.HandleUpdateOfReportDetail);



//Api to Get Data of all images in perticuar report ( Tag Image )
router.get('/detailimagdata' , isAuthenticated , ReportControler.HandleImagesInPerticularReport);


// Api to store the data of exe summry !!!!!
router.post('/storeExesummry' , isAuthenticated , Generate_Pdf.HandleStoreExcSummry);


//Api to get data of Exe summary
router.get('/exesummary' , isAuthenticated , Generate_Pdf.HandleGetSummary);

// APi to delete shape or issue from the report 
router.delete('/deleteshape' , isAuthenticated ,  ReportControler.HandleDeleteShapefromimage);


//API to update the data of issues Created on photo (imageinspaction)
router.put('/updateissue' , isAuthenticated , ReportControler.HandleUpdateImageIssue);

// API to to store Shape of Fast Inspaction 
router.post('/storefastInspaction'  , ReportControler.HandleFastInspaction);



router.delete('/deleteImage' , isAuthenticated , ReportControler.HandleDeleteImage);


// Api to get AI Gerated Data
router.post('/Aidata' , ReportControler.HandleAiData)





module.exports = router;