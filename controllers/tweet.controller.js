const db = require("../models");
const Tweet = db.tweet;
const User = db.user;

const { HTTP_STATUS } = require("../constants");

exports.getTweets = async (_, res) => {
  const tweets = await Tweet.findAll({
    include: [
      { model: User, as: "author", attributes: ["name", "username", "id"] },
    ],
  });
  Promise.all(
    tweets.map(async (value) => {
      const commentCount = await Tweet.count({
        where: { parentId: value.id },
      });
      return {
        ...value.dataValues,
        commentCount,
      };
    })
  )
    .then((values) => {
      values.length
        ? res
            .status(HTTP_STATUS.OK)
            .send({ message: "Tweet fetched sucessfully!", tweets: values })
        : res.status(HTTP_STATUS.NO_CONTENT).send();
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.getTweetById = async (req, res) => {
  const [tweetData] = await Tweet.findAll({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Tweet,
        as: "parent",
        include: {
          model: User,
          as: "author",
          attributes: ["name", "username", "id"],
        },
      },
      {
        model: Tweet,
        as: "children",
        include: {
          model: User,
          as: "author",
          attributes: ["name", "username", "id"],
        },
      },
      { model: User, as: "author", attributes: ["name", "username", "id"] },
    ],
  });
  tweetData
    ? res
        .status(HTTP_STATUS.OK)
        .send({ message: "Tweet fetched.", data: tweetData })
    : res.status(HTTP_STATUS.NO_CONTENT).send();
};

exports.updateTweet = (req, res) => {
  Tweet.update({ text: req.body.text }, { where: { id: req.params.id } })
    .then(([found]) => {
      found
        ? res.status(HTTP_STATUS.OK).send({
            message: "Tweet updated.",
          })
        : res.status(HTTP_STATUS.NO_CONTENT).send();
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.postTweet = (req, res) => {
  Tweet.create({
    text: req.body.text,
    parentId: null,
  })
    .then((dataPosted) => {
      res
        .status(HTTP_STATUS.OK)
        .send({ message: "Tweet posted sucessfully!", data: dataPosted });
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.postComment = (req, res) => {
  Tweet.create({
    text: req.body.text,
    parentId: req.body.parentId,
  })
    .then((dataPosted) => {
      res
        .status(HTTP_STATUS.OK)
        .send({ message: "Comment posted sucessfully!", data: dataPosted });
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.deleteTweet = async (req, res) => {
  Tweet.destroy({ where: { id: req.params.id } })
    .then((found) => {
      found
        ? res.status(HTTP_STATUS.OK).send({ message: "Tweet deleted." })
        : res.status(HTTP_STATUS.NO_CONTENT).send();
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
