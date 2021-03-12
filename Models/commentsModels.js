const connection = require("../db/connection");

const postCommentToArticles = function (commentData) {
  return connection("comments").insert(commentData).returning("comments");
};

const fetchComments = function (article_id) {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id: article_id });
};

module.exports = { postCommentToArticles, fetchComments };
