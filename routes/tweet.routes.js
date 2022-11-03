const { auth } = require("../middleware");
const controller = require("../controllers/tweet.controller");
const { verifyToken } = require("../middleware/auth");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/tweets", verifyToken , controller.getTweets);

  app.get("/tweets/:id", verifyToken, controller.getTweetById);

  app.post("/tweets/", verifyToken, controller.postTweet);

  app.post("/tweets/comments", verifyToken, controller.postComment);

  app.patch("/tweets/:id", verifyToken, controller.updateTweet);

  app.delete("/tweets/:id", verifyToken, controller.deleteTweet);
};