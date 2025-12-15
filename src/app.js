const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(cookieParser());
app.use(express.json());


app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
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
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).send("Invalid password");
      } else {
        //create a JWT token and send it to the user
        const token = await jwt.sign({ _id: user._id }, "DEV@123", { expiresIn: '1d' });
        console.log("Generated JWT Token:", token);

        //Add the token to cookie and send the response back to the user

        res.cookie('token', token);

        res.send("Login successful");
      }
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("something went wrong");
    return;
  }
});

//profile API

app.get('/profile', userAuth, async (req, res) => {

  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).send("something went wrong");
    return;
  }
});

app.post('/sendConnectRequest', userAuth, async (req, res) => {
  const requestingUser = req.user;  
  res.send("Connect request was send by " + requestingUser.firstName);
});
// Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body?.emailId;
  if (!userEmail) {
    return res.status(400).send("EmailId is required");
  }
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).send("something went wrong");
    return;
  }
});

// Feed API - Get all users 

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("something went wrong");
    return;
  }

});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;

  console.log("Deleting user with ID:", userId);
  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("something went wrong");
    return;
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  console.log("Updating user with ID:", userId);
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills.length > 10) {
      throw new Error("skill cannot be more than 10")
    }
    const result = await User.findByIdAndUpdate(userId, req.body, { returnDocument: 'after', runValidators: true });
    console.log(result);
    if (!result) {
      return res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }
  } catch (err) {
    console.log(err, "test")
    console.error("Error updating user:", err);
    res.status(400).send("Update failed:" + err.message);
    return;
  }
});

// Connect to the database
connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.log("Database connection failed");
  console.error(err);
});


