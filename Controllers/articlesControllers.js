const { fetchArticle, updateTheVotes } = require("../Models/articlesModels");

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
  updateTheVotes(article_id, inc_votes).then((article) => {
    res.status(200).send({ updatedArticle: article });
  });
};

module.exports = { getArticle, updateVotes };
