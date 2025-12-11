const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", (req, res) => {
  res.send('Hello World! 45');
});

app.use("/hello", (req, res) => {
  res.send('Hello hello!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});