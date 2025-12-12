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
  // const userObj={
  //   firstName: "Virat",
  //   lastName: "kolhi",
  //   emailId: "jsaonh@gmail.com",
  //   password: "johns@123",
  //   age: 25,}
  //   // Create a new user instance and save it to the database
  //   const user = new User(userObj);
    user.save().then(() => {
      console.log("User saved successfully");
    }).catch((err) => {
      console.error("Error saving user:", err);
    });
     res.send('user added sucessfully');
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


