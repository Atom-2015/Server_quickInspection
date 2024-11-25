const mongoose = require('mongoose');
const express = require('express')
const ReportInside = require('../models/report_inside/report_inside_comp');
const Company = require('../models/company/company');
const User = require('../models/user/user');





module.exports.HandleStorage = async (req, res) => {

  if (!req.headers['x-company-id']) {
    return res.status(400).json({ message: 'Missing Company ID' });
  }

  const { inspactionname, issuetype, componentname } = req.body;
  console.log(req.body);
  if (
    !Array.isArray(componentname) ||
    typeof inspactionname !== 'string' ||
    inspactionname.trim() === '' ||
    !Array.isArray(issuetype) ||
    issuetype.some((type) => typeof type !== 'string' || type.trim() === '')
  ) {
    return res.status(400).json({ message: 'Please enter valid data' });
  }

  try {
    const companyId = req.headers['x-company-id'];
    const reportInside = await ReportInside.create({
      company: companyId,
      issuetype: issuetype,
      inspaction: {
        inspactionname: inspactionname.trim(),
        componentname: componentname.map((type) => type.trim()),
      },
    });

    if (!reportInside) {
      return res.status(400).json({ message: 'Unable to store the data' });
    }

    // Return success response
    return res.status(200).json({
      message: 'Data stored successfully',
      data: reportInside,
    });
  } catch (error) {
    console.error(`Error while storing the data in catch: ${error}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};







module.exports.HandleRetriveReportInsidedata = async (req, res) => {
  const componentname = req.query.param1;
  console.log(`componet name ; ${componentname} company id ${req.headers['x-company-id']}`);
  if (!componentname || !req.headers['x-company-id']) {
    return res.status(401).json({
      message: 'Missing Data',
    })
  }

  try {
    const response = await ReportInside.findOne({
      $and: [
        { "component.componentname": componentname },
        { company: req.headers['x-company-id'] }
      ]
    });
    if (!response) {
      return res.status(401).json({ message: 'No date found' })
    }
    return res.status(200).json({
      message: 'Data Found Suscussfully',
      data: response
    });
  } catch (error) {
    console.error(`Error while storing the data in catch: ${error}`);
    return res.status(404).json({ message: 'Internal Server Error' })
  }
}





//Api to show all component and its issue

module.exports.HandleAllComponentData = async (req, res) => {
  if (!req.headers['x-company-id']) {
    return res.status(401).json({
      message: 'Missing Data',
    })
  }
  try {
    const response = await ReportInside.find({ company: req.headers['x-company-id'] });
    if (!response) {
      return res.status(401).json({ message: 'No date found' })
    }
    return res.status(200).json({
      message: 'Data Extracted',
      data: response
    })

  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'No date found' })
  }
}





module.exports.HandleallComponentName = async (req, res) => {
  const company_id = req.headers['x-company-id'];
  const inspactiontype = req.headers['x-inspaction-type'];
  console.log(`compid ${company_id} , insptype ${inspactiontype}`)
  if (!company_id || !inspactiontype) {
    return res.status(400).json({ message: 'Missing Data' });
  }

  try {
    const response = await ReportInside.find({
      $and: [
        { company: company_id },
        { 'inspaction.inspactionname': inspactiontype }
      ]
    });
    if (response.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json({
      message: "Data Found",
      data: response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}







// ************* API to Delete component data of ************ //
module.exports.HandleDeleteComponentData = async (req, res) => {
  if (!req.headers['x-component-id']) {
    return res.status(401).json({
      message: "Component Id is required"
    })
  }
  try {
    const response = await ReportInside.findByIdAndDelete(req.headers['x-component-id'])
    if (!response) {
      return res.status(401).json({
        message: "Unable to delete"
      })
    }
    return res.status(200).json({
      message: "Component Data Deleted Successfully",
    })

  } catch (error) {
    return res.status(404).json({
      message: "Unable to delete"
    })
  }
}


// Api to update the data of component
// module.exports.HandlecomponentUpdate = async (req, res) => {
//   console.log(req.body)
//   const { componentname, issuetype, inspactionname } = req.body;
//   const componentid = req.headers['x-component-id'];
  
//   try {
//     const response = await ReportInside.findByIdAndUpdate(
//        componentid ,
//       {$set:{
//        issuetype: issuetype,
//       'inspaction.componentname': componentname,
//       'inspaction.inspactionname': inspactionname
//     }},
//     { new: true })
//     if (response.matchedCount === 0) {
//       return res.status(404).json({ message: "No matching report found" });
//     }

//     if (response.modifiedCount === 0) {
//       return res.status(200).json({ message: "No changes were made" });
//     }
//     return res.status(200).json({ 
//       message: "Component Data Updated Successfully",
//       data : response
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(404).json({
//       message: "Server Error"
//     })
//   }
// }
module.exports.HandlecomponentUpdate = async (req, res) => {
  console.log('Request Body:', req.body); // Debugging log
  const { inspectionName, componentName, issueType } = req.body;
  const componentid = req.headers['x-component-id'];

  // Validate that componentid is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(componentid)) {
    return res.status(400).json({ message: 'Invalid Component ID' });
  }

  try {
    // Use findByIdAndUpdate with proper field names matching the schema
    const response = await ReportInside.findByIdAndUpdate(
      componentid, // Pass component ID directly
      {
        $set: {
          'inspaction.inspactionname': inspectionName,
          'inspaction.componentname': componentName,
          issuetype: issueType,
        },
      },
      { new: true, runValidators: true } // Return updated document and run validators
    );

    // Handle case where no document was found
    if (!response) {
      return res.status(404).json({ message: 'No matching component found' });
    }

    return res.status(200).json({
      message: 'Component Data Updated Successfully',
      data: response,
    });

  } catch (error) {
    console.error('Error updating component:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};



// Api to get the data of perticular  component

module.exports.HandlesingleComoponentData = async (req , res)=>{
  if(!req.headers['x-component-id']){
    return res.status(402).json({
      message:"Component Id is Required"
    })
  }
  
  try {
      const response = await ReportInside.findById(req.headers['x-component-id'])
      if(!response){
        return res.status(403).json({
          message:"No data found For Perticular Id"
        })
      }    
      return res.status(200).json({
        message:"Data Found",
        data:response
      })
    } catch (error) {
      return res.status(403).json({
        message:"No data found For Perticular Id"
      })
    }
}