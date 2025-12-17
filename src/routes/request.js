const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        allowedStatuses = ['ignored','interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status value");
        }
if (fromUserId.toString() === toUserId) {
            return res.status(400).send("You cannot send a connection request to yourself");
        }
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).send("Recipient user not found");
        }
        // Check if a request already exists between these users
        const existingRequest = await ConnectionRequest.findOne({ $or: [
            { fromUserId: fromUserId, toUserId: toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
          ], });

   
        if(existingRequest){
            return res.status(400).send("Request already exists between these users");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        const savedRequest = await connectionRequest.save(); // this will save the request to the database
        console.log("Connection request saved:", savedRequest);
        res.json({ message: req.user.firstName + "is Interested in"+toUser.firstName, data: savedRequest });

    } catch (err) {
        console.error("Error sending interested request:", err);
        res.status(500).send("something went wrong");
        return;
    }




});

module.exports = requestRouter;
