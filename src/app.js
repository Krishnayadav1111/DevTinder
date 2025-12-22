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
const cors = require('cors');

app.use(cookieParser());
app.use(express.json());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


// // Get user by email
// app.get('/user', async (req, res) => {
//   const userEmail = req.body?.emailId;
//   if (!userEmail) {
//     return res.status(400).send("EmailId is required");
//   }
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       return res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     console.error("Error retrieving user:", err);
//     res.status(500).send("something went wrong");
//     return;
//   }
// });

// // Feed API - Get all users 

// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     console.error("Error retrieving users:", err);
//     res.status(500).send("something went wrong");
//     return;
//   }

// });

// app.delete('/user', async (req, res) => {
//   const userId = req.body.userId;

//   console.log("Deleting user with ID:", userId);
//   try {
//     const result = await User.findByIdAndDelete(userId);
//     if (!result) {
//       return res.status(404).send("User not found");
//     } else {
//       res.send("User deleted successfully");
//     }
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).send("something went wrong");
//     return;
//   }
// });

// app.patch('/user/:userId', async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   console.log("Updating user with ID:", userId);
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data.skills.length > 10) {
//       throw new Error("skill cannot be more than 10")
//     }
//     const result = await User.findByIdAndUpdate(userId, req.body, { returnDocument: 'after', runValidators: true });
//     console.log(result);
//     if (!result) {
//       return res.status(404).send("User not found");
//     } else {
//       res.send("User updated successfully");
//     }
//   } catch (err) {
//     console.log(err, "test")
//     console.error("Error updating user:", err);
//     res.status(400).send("Update failed:" + err.message);
//     return;
//   }
// });

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


