const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// it will work for /ac,/abc 
app.get("/ab?c", (req, res) => {
  res.send('Hello hello! hgfhgf gfhgfhf');
});

app.get("/ab+c", (req, res) => {
  res.send('Hello hello! hgfhgf gfhgfhf');
});
app.get("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
  res.send('Hello hello! hgfhgf gfhgfhf');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});