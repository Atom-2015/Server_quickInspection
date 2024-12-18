const express = require('express')
const router = express.Router();
const isAuthenticated = require('../middleware/isAuth_middleware');
const CreateUser = require('../controler/User_Controler');
const CreateCompany = require('../controler/Company_Controler');


router.post('/usermanagement' , isAuthenticated , CreateUser.HandleCreteUser);



// ******** Company Creation rout ************
router.post('/createcompany' , isAuthenticated , CreateCompany.HandleCompanyCreation);

//************ Company list rout *******************/
router.get('/companylist' , isAuthenticated , CreateCompany.CompanyList);


// ************** Delete Company api ************
router.delete('/deletecompany'  , CreateCompany.deleteCompany)



module.exports = router; 