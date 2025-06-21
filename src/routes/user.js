const express = require("express");
const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "gender",
      "age",
      "about",
      "skills",
    ]);
    const data = connectionRequest.map((row) => ({
      fromUserId: row.fromUserId,
      createdAt: Date.now() - row.createdAt + "h ago ",
    }));

    res.json({ message: "Data Fetched Succesfuly!!", data });
  } catch (err) {
    res.status(404).json({ message: "ERROR:" + err.message });
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "age",
        "about",
        "skills",
      ])
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "age",
        "about",
        "skills",
      ]);
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(404).json({ message: "ERROR:" + err.message });
  }
});

module.exports = userRouter;
