const {
  fetchArticle,
  updateTheVotes,
  doesArticleExist,
  fetchAllArticles,
} = require("../Models/articlesModels");
const {
  postCommentToArticles,
  fetchComments,
} = require("../Models/commentsModels");
const { doesUsernameExist } = require("../Models/usersModels");

const getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { author } = req.query;
  const { topic } = req.query;

  fetchAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      if (articles.length > 1) {
        res.status(200).send({ articles: articles });
      } else {
        res.status(200).send({ articles: articles[0] });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article: article[0] });
    })
    .catch((err) => {
      next(err);
    });
};

const updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes) {
    Promise.all([
      updateTheVotes(article_id, inc_votes),
      doesArticleExist(article_id),
    ])
      .then((article) => {
        res.status(200).send({ updatedArticle: article[0][0] });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchArticle(article_id)
      .then((article) => {
        res.status(200).send({ updatedArticle: article[0] });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentData = req.body;
  commentData.article_id = article_id;
  if (commentData.body === "") {
    const err = { status: 400, msg: "Bad request; missing comment content" };
    next(err);
  } else {
    postCommentToArticles(commentData)
      .then((newComment) => {
        res.status(201).send({ comment: newComment[0] });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sorted_by } = req.query;
  Promise.all([
    fetchComments(article_id, sorted_by),
    doesArticleExist(article_id),
  ])
    .then((comments) => {
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticle,
  updateVotes,
  postComment,
  getComments,
  getAllArticles,
};
