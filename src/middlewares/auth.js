const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    // Read the token from the cookies
    const cookies = req.cookies;
    try {
        const { token } = cookies;
        // validate the token
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decodedMessage = jwt.verify(token, "DEV@123");
        console.log("Decoded JWT Message:", decodedMessage);
        const { _id } = decodedMessage;
        console.log("User ID from token:", _id);
        //Find the user from the token

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Error during authentication:", err);
        res.status(500).send("something went wrong");
        return;
    }
    //If user not found send 404
    //If user found attach user to req object and call next()
}

module.exports = { userAuth };