const jwt = require('jsonwebtoken')
const User = require('../models/user/user')
const Company = require('../models/company/company')

 

// module.exports.HandleSignup = async(req , res)=>{
//     try {
//         if(String(req.body.password) !== String(req.body.confirmpassword)){
           
           
//             return res.status(400).json({
//                 message:'Password dosent match'
//             });
//         }
//         const EmailCheck = await User.findOne({ email: req.body.email });
//         if (EmailCheck) {      
//             return  res.status(400).json({
//                 message: 'Email already exists'
//             })

//         }
//         const company = await Company.findOne({
//             company_name:req.body.company
//         })
//         if(!company){
//             const companycreation = await Company.create({
//                 company_name:req.body.company,
//                 createdBy:req.body.name
//             }) 
//             if(!companycreation){
//                 return res.status(400).json({
//                     message:'Company creation failed'
//                 })
//             }
//             res.json({
//                 message:'Company created successfully'
//             })
//         }else{
//             return res.status(400).json({
//                 message:'Company already exists contact your company Admin'
//             })
//         }

//         const user1 = await User.create({
//             name:req.body.name,
//             email:req.body.email,
//             password:req.body.password
//         })
//         if(!user1){
//             return res.status(400).json({
//                 message:'unable to create the user'
//             })
//         }
//     }catch (error) {
//         console.log(`**********************error in creation ************************${error}`);
//         return res.send(error); 
        
//     }
// }

 

module.exports.HandleSignup = async (req, res) => {
    try {
       
        if (String(req.body.password) !== String(req.body.confirmpassword)) {
            return res.status(400).json({
                message: 'Password does not match',
            });
        }

       
        const emailCheck = await User.findOne({ email: req.body.email });
        if (emailCheck) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }

        let company = await Company.findOne({ company_name: req.body.company });

        if (!company) {
            company = await Company.create({
                company_name: req.body.company,
                createdBy: req.body.name
            });

            if (!company) {
                return res.status(400).json({
                    message: 'Company creation failed',
                });
            }

           
            console.log('Company created successfully');
        }
        const user1 = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            company_name: company._id
        });

        if (!user1) {
            return res.status(400).json({
                message: 'Unable to create the user',
            });
        }

        return res.status(201).json({
            message: 'User and company created successfully',
            user: user1,
            company: company,
        });

    } catch (error) {
        console.error('********************** Error in creation ************************', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};








//SignIn Api
const privated = process.env.SECRET_KEY;

module.exports.HandleSignin = async (req, res) => {
    try {    
        console.log("This is body " ,req.body);
            
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }        
        if (user.password !== req.body.password) {
            return res.status(400).json({ message: 'Invalid password' });
        }        
        const token = jwt.sign({
            email: user.email,
            name: user.name,
            company_id:user.company_id
        },privated, { expiresIn: '1d' });
        // return res.status(200).json({ token });
        // console.log("************" , user.body.email);
        return res.json({status:200 , user:token , company_id:user.company_name})

    } catch (error) {
        console.log(`***************************error in Sign In**************************** ${error}`);
        return res.status(500).json({ message: 'Internal server error', error });
    }  
};








// ********  User Creation (User Management ) ***********

module.exports.HandleCreteUser = async(req , res)=>{
    console.log("req user is ",req.user);
    console.log(req.body);
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.userRole ) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    const company = await Company.findOne({company_name: req.body.companyName});
    console.log(company.company_name)
    const response = await User.findOne({
        email: req.body.email,
        company_name:req.body.company_id
    })
    console.log("prining the data of useremail and company name",response);
    if(response){
        return res.status(400).json({ message: "Duplicate Data" });
    }  
    
    try {
        const response = await User.create({
            name:  req.body.name,
            email:  req.body.email,
            password: req.body.password,
            company_name: req.body.companyName,
            user_role: req.body.userRole,
            user_expiry_date: req.body.userExpiryDate,
            user_creted_by : req.user.name,
            company_name : company._id
        });
        if(!response){
            return res.status(400).json({message:'User not created'});
        } 
        return res.status(200).json({message:'user Created successfully '})
    } catch (error) {
        console.log('Error whele  creating user form management', error);
        return res.status(400).json({
            message: 'Internal Server Error',
        })   
        
    }
}

// module.exports.HandleCreteUser = async(req , res)=>{
//     res.status(200).json({
//         message: 'User Created successfully '
//     })
// }




module.exports.HandleUserList = async(req , res)=>{
    try {
        const response = await User.find({});
        if(!response){
            return res.status(400).json({message:'No user found'});
        }
        return res.status(200).json({
            message:'User List',
            data: response
        })
        
    } catch (error) {
        console.log("**************the error in api of get list fo user *************" , error)
        return res.status(400).json({
            message:"Error in the api"
        })
    }
}



// Delete User from user list
module.exports.HandleDeleteUser = async(req , res )=>{
    const userid = req.headers['x-delete-userid'];
    console.log(userid);
    if(!userid) return res.status(403).json({message:"Improper Data"});

    try {
        const response = await User.findByIdAndDelete(userid);
        if(!response){
            return res.status(400).json({message:'User Not Deleted'});
        }
        return res.status(200).json({
            message:"User Deleted",
            data:response
        })
    } catch (error) {
        return res.status(404).json({
            message:"Internal Server Error"
        })
    }
}




 