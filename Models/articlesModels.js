const connection = require("../db/connection");

const fetchArticle = function (article_id) {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article not found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

//not all articles have comments
//therefore we want to left join so articles with no comments are not lost
//going to end up with lots of comment rows for one article - we need to group these together
//count order? does it need to be in a then block?
//where- when we dont pass in a param will where be ignored

const updateTheVotes = function (article_id, inc_votes) {
  return connection("articles")
    .where({ article_id: article_id })
    .increment({ votes: inc_votes })
    .returning("*");
};

const doesArticleExist = function (article_id) {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id: article_id })
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article not found for article_id: ${article_id}`,
        });
      }
    });
};
module.exports = { fetchArticle, updateTheVotes, doesArticleExist };
