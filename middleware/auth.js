const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { HTTP_STATUS } = require("../constants/index.js");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "Unauthorized! Access Token expired!" });
  }

  return res
    .sendStatus(HTTP_STATUS.UNAUTHORIZED)
    .send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(HTTP_STATUS.FORBIDDEN).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

const auth = {
  verifyToken: verifyToken,
};

module.exports = auth;
