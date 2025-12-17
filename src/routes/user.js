const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

//Get all the pending connection requests for logged in user
userRouter.get('/user/requests/pending', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        console.log("Logged in user ID:", loggedInUserId);
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName photoUrl age gender location skills about');
        res.json({ data: pendingRequests });
    } catch (err) {
        console.error("Error retrieving pending requests:", err);
        res.status(500).send("something went wrong");
        return;
    }
});


module.exports = userRouter;