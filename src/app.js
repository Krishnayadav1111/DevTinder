const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/hello/2", (req, res) => {
  res.send('Hello hello! hgfhgf gfhgfhf');
});

//this will match all the HTTP methods (GET, POST, PUT, DELETE, etc.) for the /hello route
app.use("/hello", (req, res) => {
  res.send('Hello hello!');
});

app.use("/", (req, res) => {
  res.send('Hello World! 45');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});