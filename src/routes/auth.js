const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validateSignUpData } = require('../utils/validation');

// Sign-up route
authRouter.post('/signup', async (req, res) => {
  console.log(req.body, "reqbody");
  const userObj = req.body;
  // Validate the incoming data
  validateSignUpData(req);
  const passwordHash = await bcrypt.hash(userObj.password, 10);
  console.log(passwordHash, "passwordHash");
  // Create a new user instance and save it to the database
  const user = new User({
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    emailId: userObj.emailId,
    password: passwordHash,
    age: userObj.age,
    gender: userObj.gender,
    photoUrl: userObj.photoUrl,
    about: userObj.about,
    skills: userObj.skills
  });
  try {
    await user.save();
    console.log("User saved successfully");
    res.send('User added successfully');
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(400).send("Error saving user: " + err.message);
  }
});

// login API
authRouter.post('/login', async (req, res) => {
  const { emailId, password } = req.body;
  //sanitize the the mailId and password inputs
  if (!emailId || !password) {
    return res.status(400).send("EmailId and password are required");
  }
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalide credentials");
    } else {
      const isPasswordMatch = await user.validatePassword(password);
      if (!isPasswordMatch) {
        return res.status(401).send("Invalid password");
      } else {
        //create a JWT token and send it to the user
        const token = await user.getJWT();
        console.log("Generated JWT Token:", token);

        //Add the token to cookie and send the response back to the user

        res.cookie('token', token);

        res.send( {message:"Login successful",data:user, token: token} );
      }
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("something went wrong");
    return;
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send("Logout successful");
});

module.exports = authRouter;