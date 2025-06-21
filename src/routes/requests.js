const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const { equals } = require("validator");
const { ConnectionStates } = require("mongoose");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_REQUESTS = ["interested", "ignored"];
      if (!ALLOWED_REQUESTS.includes(status)) {
        throw new Error("Request Invalid ");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User Not  Found ");
      }
      if (fromUserId.equals(toUserId)) {
        throw new Error("Request Invalid ");
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Connection Request Already sent ");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({ message: "Requset Sent !!", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const ALLOWED_REQUESTS = ["accepted", "rejected"];
      if (!ALLOWED_REQUESTS.includes(status)) {
        throw new Error("Invalid status value. ");
      }
      const loggedInUser = req.user;
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("No pending request found or unauthorized access ");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: loggedInUser.firstName + ", " + status + " the request !",
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
