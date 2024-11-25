  const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        unique: true
    },
    company_expiry: { 
        type: Date
    },
    createdBy: {
        type:String
    }
}, { timestamps: true }); 

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
