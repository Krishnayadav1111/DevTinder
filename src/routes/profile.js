const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
// Get user profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.json({ message: "Profile retrieved successfully", success:true, data: user });
    } catch (err) {
        console.error("Error retrieving profile:", err);
        res.json({ message: "something went wrong", success:false });
        return;
    }
});
// Update user profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid profile data");
        }
        const loggedInUser = req.user;
        console.log("Logged-in user:", loggedInUser);

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        console.log("Updated user data:", loggedInUser);
        await loggedInUser.save();
        res.json({ message: "Your profile updated successfully", data: loggedInUser });

    }
    catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).send("something went wrong");
        return;
    }
});

profileRouter.patch('/profile/changePassword', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Old password and new password are required");
        }
        const loggedInUser = req.user;      
        const isPasswordMatch = await loggedInUser.validatePassword(oldPassword);
        if (!isPasswordMatch) {
            return res.status(401).send("Old password is incorrect");
        }
        const bcrypt = require('bcryptjs');
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = newHashedPassword;
        await loggedInUser.save();
        res.send("Password changed successfully");
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).send("something went wrong");
        return;
    }   
});

module.exports = profileRouter;