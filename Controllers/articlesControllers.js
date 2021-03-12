const {
  fetchArticle,
  updateTheVotes,
  doesArticleExist,
} = require("../Models/articlesModels");
const {
  postCommentToArticles,
  fetchComments,
} = require("../Models/commentsModels");

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
    res.status(201).send({ newComment: newComment });
  });
};

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchComments(article_id), doesArticleExist(article_id)])
    .then((comments) => {
      console.log(comments);
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticle, updateVotes, postComment, getComments };
