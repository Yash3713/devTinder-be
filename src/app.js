const express = require("express");
const app = express();
const connectDB = require("./config/database");
app.use(express.json());
const CookieParser = require("cookie-parser");
app.use(CookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

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
