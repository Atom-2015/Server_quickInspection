const express = require('express');
const router = express.Router();
const MainControler =require('../controler/Main_Controler');
const UserControler = require('../controler/User_Controler');
const isAuthenticated = require('../middleware/isAuth_middleware');


 







// Health Route for ECR and ECS
router.get('/healthcheck' , MainControler.healthchecker);





 router.get('/home' , MainControler.main);


// **************************       For user Auth Rout        ***********************************

router.post('/Signup' , UserControler.HandleSignup);

//******************  Signin  *****************

router.post('/Signin' , UserControler.HandleSignin);

//************ User List Api ***********/

router.get('/userlist' , isAuthenticated , UserControler.HandleUserList)

// ******************* Api to Delete User *******************
router.delete('/delteuser' , isAuthenticated , UserControler.HandleDeleteUser);




// ***********  Router For Report  ***********

router.use('/main' , require('./report_generation_router'));




//************** Rout for User Management ***************

router.use('/management' , require('./Management'));


// *********************** Report component *********************

router.use('/reportinside' , require('./report_inside'));



// For Tag Image
router.use('/tagimage' , require('./tagimage'));



 module.exports = router; 