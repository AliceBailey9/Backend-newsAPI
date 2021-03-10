const fetchTopics = require("../Models/topicsModel");

const getTopics = function (req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getTopics;
