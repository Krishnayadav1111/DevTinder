const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


requestRouter.post('/sendConnectRequest', userAuth, async (req, res) => {
  const requestingUser = req.user;  
  res.send("Connect request was send by " + requestingUser.firstName);
});

module.exports = requestRouter;
