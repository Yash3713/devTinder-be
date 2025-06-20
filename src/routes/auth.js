const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating a new instance of User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Saved !!");
  } catch (err) {
    res.status(400).send("Error Occured in Saving User :" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.send("Login Suucesfull");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged Out Succesfully!!");
});
module.exports = authRouter;
