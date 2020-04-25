const jwt = require("jsonwebtoken");
const createError = require("http-errors");

function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) throw createError(401, "Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = auth;
