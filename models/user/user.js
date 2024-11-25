const mongoose = require('mongoose');
 
// const multer = require('multer');
// //ma yahi multer user kar reha hu baki kar sakra hu index.js ma but mughe yahi convinent hai
// const path = require('path');
// const AVATAR_PATH = path.join('/uploads/users/avatars');

const Address = new mongoose.Schema({
    Streetaddress:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true
    },
    zipcode:{
        type:Number,
        requered:true
    }
} , { })

const Userschema = new  mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    licence:{
        type:String,
        required:false
    },
    active_date:{
        type:Date,
        required:false
    },
    last_purchase_date:{
        type:Date,
        required:false
    },
    active_plan:{
        type:String,
        required:false
    },
    report:[{
        type:String,
        required:false
    }],
    address:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Address'
    },
    company_name:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Company',
        required:true
    },
    user_role:{
        type:String,
        enum:['Super Admin' , 'Admin' , 'User'],
        default:'Super Admin'
    },
    user_expiry_date:{
        type:Date
    },
    user_creted_by:{
        type:String,
    }


},{timestamps:true});

//copyeed from documentation of multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname),'..',AVATAR_PATH)
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + Date.now());
//     }
//   });
                 


                    // const storage = multer.diskStorage({
                    // destination: function (req, file, cb) {
                    //     cb(null, path.join(__dirname,'..', AVATAR_PATH));
                    // },
                    // filename: function (req, file, cb) {
                    //     cb(null, file.fieldname + '-' + Date.now());
                    // }
                    // });






// //static              multer ki storage ma : apni const storage ko dala hia   //  single ki place pr we could have used array if multiple inputs hote
// userschema.statics.uplodedAvatar = multer({storage : storage}).single('avatar');
// //path ko globaly accesable banaya hai bs
// userschema.statics.avatarPath = AVATAR_PATH;



const User = mongoose.model('user' , Userschema);
module.exports = User; 