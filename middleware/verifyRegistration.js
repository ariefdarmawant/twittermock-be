const { HTTP_STATUS } = require("../constants");
const db = require("../models");
const User = db.user;

checkDuplicateUsernameEmailPhoneNumber = async(req, res, next) => {
  // Username
  const usernameCheck = await User.findOne({
    where: {
      username: req.body.username,
    },
  })
  if (usernameCheck) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      message: "Username already in use!",
    });
    return;
  } 

  const emailCheck = await User.findOne({
    where: {
      email: req.body.email,
    },
  })
  if (emailCheck) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      message: "Email already in use!",
    });
    return;
  }

  // Phone Number
  const phoneCheck = await User.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  })
  if (phoneCheck) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      message: "Phone number already in use!",
    });
    return;
  } 

  if(!(usernameCheck || emailCheck || phoneCheck)){
    next();
  }
};

const verifyRegistration = {
  checkDuplicateUsernameEmailPhoneNumber:
    checkDuplicateUsernameEmailPhoneNumber,
};

module.exports = verifyRegistration;
