const express = require("express");

const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateEditProfilePassword,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Cannot Update these Fields");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (keys) => (loggedInUser[keys] = req.body[keys])
    );
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated succesfully!!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    if (!validateEditProfilePassword(req)) {
      throw new Error("Inavlid Details");
    }
    const loggedInUser = req.user;
    req.body.password = await bcrypt.hash(req.body.password, 10);
    loggedInUser.password = req.body.password;
    await loggedInUser.save();
    res.json({ message: "Password updated Sucesfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;
