

module.exports.main = async(req ,res)=>{
    try {
        const data = {name: "Aditya" , title:"panday"};
        return res.send(data);
    } catch (error) {
        return res.send(`**************This is error*********** ${error}`);
    }
}   



module.exports.healthchecker = async(req , res)=>{
    try {
        return res.status(200).json({
            message:"Every Thing Good"
        })
    } catch (error) {
       return res.status(404).json({
         message:"Error in Container Health"
       }) 
    }
}