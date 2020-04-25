const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw createError(400, "User Not Found");
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      throw createError(400, "Invalid Password");
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res
      .header("auth-token", token)
      .send({ token: token, userLevel: user.userLevel });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      throw createError(400, "Email already Exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      userLevel: req.body.userLevel,
    });
    const result = await user.save();
    res.send("User Registered");
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
