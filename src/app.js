const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/database');
const User = require('./models/user');
app.use(express.json());


app.post('/signup', (req, res) => {
 
  console.log(req.body,"reqbody");
  const userObj=req.body;
  // Create a new user instance and save it to the database
  const user = new User(userObj);
    user.save().then(() => {
      console.log("User saved successfully");
    }).catch((err) => {
      console.error("Error saving user:", err);
    });
     res.send('user added sucessfully jghgj');
});

// Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
  try {
   const user = await User.findOne({ emailId: userEmail });
   if (!user) {
      return res.status(404).send("User not found");
    } else {
  res.send(user);}  
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


