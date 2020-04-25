const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

const router = express.Router();

router.get("/", verify, (req, res) => {
  //   res.json({
  //     posts: {
  //       title: "test post",
  //       description: "random post data",
  //     },
  //   });

  res.send(req.user);
});

module.exports = router;
