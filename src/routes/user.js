const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const USER_SAFE_DATA = 'firstName lastName photoUrl age gender location skills about';

//Get all the pending connection requests for logged in user
userRouter.get('/user/requests/pending', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        console.log("Logged in user ID:", loggedInUserId);
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA);
        res.json({ data: pendingRequests });
    } catch (err) {
        console.error("Error retrieving pending requests:", err);
        res.status(500).send("something went wrong");
        return;
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const acceptedRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: 'accepted' },
                { toUserId: loggedInUserId, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', USER_SAFE_DATA);

        const data = acceptedRequests.map(row => {
            if (row.fromUserId._id.equals(loggedInUserId)) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });

        res.json({ data });
    } catch (err) {
        console.error("Error retrieving connections:", err);
        res.status(500).send("something went wrong");
        return;
    }
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        // user should see all the users cards except
        // 1. himself/herself
        // 2. users to whom he/she has sent connection request already
        // 3. users who have sent connection request to him/her already
        // 4. ignored users

        const loggedInUserId = req.user._id;
        //Find all connection requests (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select('fromUserId toUserId');
        console.log("Connection requests involving logged in user:", connectionRequests);
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });
        //Also hide himself/herself
        hideUsersFromFeed.add(loggedInUserId.toString());
        console.log("User IDs to hide from feed:", hideUsersFromFeed);


        const feedUsers = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select(USER_SAFE_DATA);
        res.json({ data: feedUsers });

    } catch (err) {
        console.error("Error retrieving user profile:", err);
        res.status(500).send("something went wrong");
        return;
    }
});


module.exports = userRouter;