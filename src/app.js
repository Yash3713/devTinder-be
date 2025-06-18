const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const CookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(CookieParser());

app.post("/signup", async (req, res) => {
  //console.log(req.body)
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  //Creating a new instance of User Model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
  try {
    await user.save();
    res.send("User Saved !!");
  } catch (err) {
    res.status(400).send("Error Occured in Saving User :" + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      const token =  await user.getJWT()
      res.cookie("token", token,{expires:new Date(Date.now()+3600000)});
      res.send("Login Suucesfull");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log("Something Went Wrong");
  }
});
app.get("/profile", userAuth,async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log("Something Went Wrong");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    req.status(404).send("UserId is Mandatory ");
  }
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log("Something Went Wrong" + err.message);
  }
});
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["userId", "about", "gender", "skills", "password"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update Not allowed");
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User Updated Succesfully" + user);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong", details: err.message });
    console.log("Something Went Wrong" + err.message);
  }
});
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
