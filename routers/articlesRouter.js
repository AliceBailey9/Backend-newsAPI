const express = require("express");
const getArticle = require("../Controllers/articlesControllers");
const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticle);

module.exports = articlesRouter;
