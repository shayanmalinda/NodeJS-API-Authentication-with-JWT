const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("mongoDB Connected ...");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db ....");
});

mongoose.connection.on("error", (err) => {
  console.log("Error: ", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected ....");
});

process.on("SIGNIT", () => {
  mongoose.connection.close(() => {
    console.log("mongoose connection is terminated due to app termination");
    process.exit(0);
  });
});

app.use("/test", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

const userRoute = require("./routes/Users.route");
app.use("/users", userRoute);

const postRoute = require("./routes/Posts.route");
app.use("/posts", postRoute);

app.use((req, res, next) => {
  const error = createError(404, "Not Found");
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on PORT ", PORT);
});
