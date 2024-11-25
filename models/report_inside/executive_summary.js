const mongoose = require('mongoose');
// const { HandleStoreExcSummry } = require('../../controler/Generate_Pdf');


const Executive_summarySchema = new mongoose.Schema({
    reportid:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'Report'
    },
    executive_summary:{
        type:String,
        maxlength: 2000000,
    }
},{timeseries:true})


const ExeSummry = mongoose.model('ExeSummry' , Executive_summarySchema);
module.exports = ExeSummry;