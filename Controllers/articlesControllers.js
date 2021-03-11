const { fetchArticle, updateTheVotes } = require("../Models/articlesModels");
const postCommentToArticles = require("../Models/commentsModels");

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateTheVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ updatedArticle: article });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  let commentData = req.body;
  commentData.article_id = article_id;
  postCommentToArticles(commentData).then((newComment) => {
    console.log(newComment);
    res.status(201).send({ newComment: newComment });
  });
};

module.exports = { getArticle, updateVotes, postComment };
