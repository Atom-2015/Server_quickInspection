const Company = require('../models/company/company');


module.exports.HandleCompanyCreation = async(req , res)=>{
    try {
        if(! req.body.company_name) {
            return  res.status(400).json({message : "Company name is required"});
        }
        const response = req.body; 
        const company_data = await Company.create({
            company_name: response.company_name, 
            company_expiry: response.company_expiry,
            createdBy:req.user.name, 
        });
        if(!company_data){
            return res.status(400).json({message: "Company creation failed"}); 
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
  