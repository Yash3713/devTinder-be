const express = require("express");

const app = express();
const connectDB= require("./config/database")
const User= require("./models/user")

app.use(express.json())

app.post("/signup", async (req,res)=>{
  //console.log(req.body)
  //Creating a new instance of User Model
  const user = new User(req.body);
  try{
    await user.save()
    res.send("User Saved !!")
  }catch(err){
    res.status(400).send("Error Occured in Saving User :"+err.message)
  }
 
})

app.get("/user",async(req,res)=>{
  const userEmail= req.body.emailId
  try{
    const user=  await User.find({emailId: userEmail}) 
    if(user.length===0){
res.status(404).send("User Not Found")
    }else{res.send(user);}
    
  }catch(err){
    console.log("Something Went Wrong")
  }
})

app.get("/feed",async(req,res)=>{
  try {
    const users =  await User.find({});
    res.send(users);
  } catch (err) {
    console.log("Something Went Wrong");
  }
  

})
connectDB()
  .then(() => {
    console.log("Database Connected");
    app.listen(3000, () => {
      console.log("Server is Running ");
    });
    
  })
  .catch((err) => {
    console.error("Database Connection Failed");
  });
