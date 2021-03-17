const connection = require("../db/connection");

const fetchAllArticles = function (sort_by, order, author, topic) {
  return connection
    .select(
      "title",
      "articles.author",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "articles.created_at", order || "desc")
    .modify((querySoFar) => {
      if (author && topic) {
        querySoFar.where("articles.author", "=", author);
        querySoFar.where("articles.topic", "=", topic);
      } else if (author) {
        querySoFar.where("articles.author", "=", author);
      } else if (topic) {
        querySoFar.where("articles.topic", "=", topic);
      }
    });
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
