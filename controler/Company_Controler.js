const Company = require('../models/company/company');
const Report = require('../models/reports/reports');
const imageProcessed = require('../models/imageProcessed/imageProcessed');
const FastInspaction = require('../models/imageProcessed/fastInspaction');
const TagImages = require('../models/tagimage/tagimage');
const user = require('../models/user/user');
// const exesummary = require('../models/exesummary/exesummary');
// const { check, validationResult } = require('express-validator'); 
const ReportInside = require('../models/report_inside/report_inside_comp');
const ImageCount = require('../models/imagecount/imagecount');

module.exports.HandleCompanyCreation = async (req, res) => {
  try {
    if (!req.body.company_name) {
      return res.status(400).json({ message: "Company name is required" });
    }
    const response = req.body;
    const company_data = await Company.create({
      company_name: response.company_name,
      company_expiry: response.company_expiry,
      createdBy: req.user.name,
    });
    if (!company_data) {
      return res.status(400).json({ message: "Company creation failed" });
    }
    return res.status(200).json({
      message: "Company created successfully",
    })
  } catch (error) {
    console.log(error);

    return res.status(404).json({
      message: "Company creation failed ************ inside HandleCompanyCreation controler **********",
    })
  }
}

module.exports.CompanyList = async (req, res) => {
  try {
    const response = await Company.find({});
    // console.log('Fetched Companies in API:', response); // Add this to log the actual response in Node.js

    if (!response || response.length === 0) {
      return res.status(400).json({
        message: "Company list not found",
      });
    }

    return res.status(200).json({
      data: response,
      message: 'Fetched Record',
    });
  } catch (error) {
    console.error('Error in API:', error); // Log any errors for better understanding
    return res.status(404).json({
      message: "Unable to fetch company list",
    });
  }
};

// Api to delete company from Management

// module.exports.deleteCompany = async (req, res) => {
//   if (!req.headers['x-company-id'] || !req.headers['x-report-id']) {
//     return res.status(400).json({ message: "Company ID and Report id is required" });
//   }
//   try {
//     const company_id = req.headers['x-company-id'];

//     const companyName = req.body.companyName;

//     const response = await Company.findByIdAndDelete(company_id);
//     if (!response) {
//       console.log(response)
//       return res.status(404).json({ message: "Error While Deleting Company" });
//     }
//     await user.deleteMany({
//       company_name: company_id
//     })
//     const allreport = Report.find({
//       inspaction_company_owner: companyName
//     });

//     if (allreport.length > 0) {

//       for (let i = 0; i < allreport.length; i++) {
//         const reportId = allreport[i]._id;
//         await FastInspaction.deleteMany({
//           reportid: reportId
//         });

//         await imageProcessed.deleteMany({
//           reportid: reportId
//         });

//         await ReportInside.deleteMany({
//           reportid: reportId
//         });

//         await TagImages.deleteMany({
//           reportid:reportId
//         }) 

//       }
//     }

//     await Report.deleteMany({
//       inspaction_company_owner: companyName
//     })

//     return res.status(200).json({
//       message: 'Company Deleted',
//     })
//   } catch (error) {
//     console.log(error);
//     return res.status(404).json({ message: "Internal Server Error" });
//   }
// }



module.exports.deleteCompany = async (req, res) => {
  if (!req.headers['x-company-id']) {
    return res.status(400).json({ message: "Company ID are required" });
  }
  const company_id = req.headers['x-company-id'];
  try {
    const companyName = await Company.findById(company_id).select("company_name")
    const companyDeleteResult = await Company.findByIdAndDelete(company_id);
    if (!companyDeleteResult) {
      return res.status(404).json({ message: "Error While Deleting Company" });
    }

    await user.deleteMany({ company_name: company_id });

    const allReports = await Report.find({ inspaction_company_owner: companyName });

    if (allReports.length > 0) {

      const deletePromises = allReports.map(async (report) => {
        const reportId = report._id;

        return Promise.all([
          FastInspaction.deleteMany({ reportid: reportId }),
          imageProcessed.deleteMany({ reportid: reportId }),
          ReportInside.deleteMany({ reportid: reportId }),
          TagImages.deleteMany({ reportid: reportId })
        ]);
      });

      await Promise.all(deletePromises);
    }

    await Report.deleteMany({ inspaction_company_owner: companyName });

    return res.status(200).json({ message: 'Company and related data deleted successfully' });

  } catch (error) {
    console.error('Error during deletion process:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


