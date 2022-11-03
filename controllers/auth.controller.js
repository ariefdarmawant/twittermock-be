const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const RefreshJwt = db.refreshJwt

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { HTTP_STATUS } = require("../constants");

exports.register = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((createdUser) => {
      res.status(HTTP_STATUS.OK).send({ message: "User created sucessfully!", data: createdUser });
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.login = (req, res) => {
  User.findOne({
    where: {
      [Op.or]: [
        { username: req.body.query },
        { phoneNumber: req.body.query },
        { email: req.body.query },
      ],
    },
  })
    .then(async(user) => {
      if (!user) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      //Expired dalam 1 jam
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshJwt.createToken(user);

      res.status(HTTP_STATUS.OK).send({
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        accessToken: token,
        refreshToken: refreshToken,
      });
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.refreshJwt = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshJwt.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshJwt.verifyExpiration(refreshToken)) {
      RefreshJwt.destroy({ where: { id: refreshToken.id } });
      
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(HTTP_STATUS.OK).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(HTTP_STATUS.BAD_GATEWAY).send({ message: err });
  }
};
