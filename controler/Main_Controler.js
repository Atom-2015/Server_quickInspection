

module.exports.main = async(req ,res)=>{
    try {
        const data = {name: "Aditya" , title:"panday"};
        return res.send(data);
    } catch (error) {
        return res.send(`**************This is error*********** ${error}`);
    }
}   