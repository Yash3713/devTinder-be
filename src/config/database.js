const mongoose= require('mongoose')

const connectDB= async()=>{
    await mongoose.connect(
      "mongodb+srv://yg4798:0ZY2BkQccNX6eHeo@devtinder.odkv8hb.mongodb.net/devTinder"
    );
}

module.exports= connectDB
