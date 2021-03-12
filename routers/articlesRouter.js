const express = require("express");
const {
  getArticle,
  updateVotes,
  postComment,
  getComments,
  getAllArticles,
} = require("../Controllers/articlesControllers");
const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:article_id", getArticle);

articlesRouter.patch("/:article_id", updateVotes);

articlesRouter.post("/:article_id/comments", postComment);

articlesRouter.get("/:article_id/comments", getComments);

module.exports = articlesRouter;
