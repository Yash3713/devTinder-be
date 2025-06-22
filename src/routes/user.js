const express = require("express");
const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const userRouter = express.Router();
const USER_DATA = ["firstName", "lastName", "gender", "age", "about", "skills"];

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);
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
      .populate("fromUserId", USER_DATA)
      .populate("fromUserId", USER_DATA);
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
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hiddenUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
        { gender: { $ne: loggedInUser.gender } },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: user });
  } catch (err) {
    res.status(400).json({ message: "ERROR:" + err.message });
  }
});

module.exports = userRouter;
