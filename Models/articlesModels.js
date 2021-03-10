const connection = require("../db/connection");

const fetchArticle = function (article_id) {
  return connection
    .select(
      "name AS author",
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes"
    )
    .from("articles")
    .join("users", "articles.author", "=", "users.username")
    .where({ article_id: article_id })
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

module.exports = fetchArticle;
