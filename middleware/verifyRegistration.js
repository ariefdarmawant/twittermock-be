const db = require("../models");
const User = db.user;
const HTTP_STATUS = require("../constants");

checkDuplicateUsernameEmailPhoneNumber = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(HTTP_STATUS.BAD_REQUEST).send({
        message: "Username already in use!",
      });
      return;
    }
  });

  // Email
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Email already in use!",
      });
      return;
    }
  });

  // Phone Number
  User.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  }).then((user) => {
    if (user) {
      res.status(HTTP_STATUS.BAD_REQUEST).send({
        message: "Phone number already in use!",
      });
      return;
    }
  });

  next();
};

const verifyRegistration = {
  checkDuplicateUsernameEmailPhoneNumber:
    checkDuplicateUsernameEmailPhoneNumber,
};

module.exports = verifyRegistration;
