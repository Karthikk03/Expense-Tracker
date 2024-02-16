const jwt=require('jsonwebtoken');
const secret=require('../util/secret');


module.exports=async(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const secretKey=await secret();
        const user=jwt.verify(token,secretKey);
        req.userId=user.id;
        next();
    }
    catch(e){
        console.log(e);
    }
}
