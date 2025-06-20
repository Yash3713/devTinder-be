const express = require("express");
const app = express();
const connectDB = require("./config/database");
app.use(express.json());
const CookieParser = require("cookie-parser");
app.use(CookieParser());


const authRouter= require("./routes/auth")
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/",authRouter)
app.use("/", profileRouter);
app.use("/", requestRouter);
// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = ["userId", "about", "gender", "skills", "password"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update Not allowed");
//     }
//     if (data.password) {
//       data.password = await bcrypt.hash(data.password, 10);
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("User Updated Succesfully" + user);
//   } catch (err) {
//     res
//       .status(500)
//       .send({ error: "Something went wrong", details: err.message });
//     console.log("Something Went Wrong" + err.message);
//   }
// });
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
