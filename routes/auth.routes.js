const { verifyRegistration } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/auth/registration",
    verifyRegistration.checkDuplicateUsernameEmailPhoneNumber,
    controller.register
  );

  app.post("/auth/login", controller.login);

  app.post("/auth/refreshJwt", controller.refreshJwt);
};
