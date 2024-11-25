const mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/FutureLand-DB")
// // 122.162.145.199/32
//     // mongoose.connect("mongodb+srv://ankithooda1314:DrGUmjacT508HBNH@futureland.iwwd5.mongodb.net/FutureLand-DB")
//     .then(()=>console.log("***************connected to data base***************"))
//     .catch((err)=>console.log("*************errer in connecting to data base********************" ,err)); 

// mongodb://localhost:27017
  

 






// mongodb+srv://adityapandey1986ad:<db_password>@cluster0.zf1fr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


  



(async () => {
    try {
      const response = await mongoose.connect(`${process.env.MONGODB_URI}/FutureLand`);
      console.log("***************connected to data base***************" , response.connection.host);
    } catch (error) {
      console.error("*************errer in connecting to data base********************", error);
    }  
  })();

//   module.exports db; 