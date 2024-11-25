const jwt = require('jsonwebtoken');

const isAuthenticated= async(req ,res,next)=>{
    // console.log("token printing in auth middleware " ,req.headers['x-auth-token']);
    
    const token  = req.headers['x-auth-token'];
    
    if(!token ){
        return res.status(401).send({message:'No token provided'});
    }
    try {
        const decode = jwt.verify(token , process.env.SECRET_KEY);
        req.user = decode;
        next();    
    } catch (error) {
        return res.status(403).json({message:'Not a valed  token'});

    }         


}

module.exports = isAuthenticated; 