const jwt = requre("jsonwebtoken");


function setUser(user){ 
    return  jwt.sign(payload , process.env.SECRET_KEY); 
}