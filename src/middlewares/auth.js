const jwt= require("jsonwebtoken")
const User= require("../models/user")

const userAuth = async (req, res, next) => {
 try{
  const {token}= req.cookies
  if(!token){
    throw new Error("Please Login!!")
  }
  const decodedVal= await jwt.verify(token,"Intheend@123")
  const{_id}= decodedVal;
  const user=  await User.findById(_id)
  if(!user){
    throw new Error("Invalid Credentials")
  }
  req.user= user
  next()
 }catch(err){
  res.status(400).send("ERROR:"+err.message)
 }
};

module.exports={
    userAuth
}