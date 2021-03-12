const connection = require("../db/connection");

const fetchAllArticles = function (sort_by) {
  return connection
    .select("*")
    .from("articles")
    .orderBy(sort_by || "created_at");
};

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
module.exports = {
  fetchArticle,
  updateTheVotes,
  doesArticleExist,
  fetchAllArticles,
};
