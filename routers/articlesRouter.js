const express = require("express");
const {
  getArticle,
  updateVotes,
} = require("../Controllers/articlesControllers");
const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticle);

articlesRouter.patch("/:article_id", updateVotes);

module.exports = articlesRouter;
