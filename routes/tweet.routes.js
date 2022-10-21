const { auth } = require("../middleware");
const controller = require("../controllers/tweet.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/tweets", controller.getTweets);

  app.get("/tweets/:id", controller.getTweetById);

  app.post("/tweets/", controller.postTweet);

  app.post("/tweets/comments", controller.postComment);

  app.patch("/tweets/:id", controller.updateTweet);

  app.delete("/tweets/:id", controller.deleteTweet);
};