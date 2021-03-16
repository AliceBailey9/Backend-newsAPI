const connection = require("../db/connection");

const postCommentToArticles = function (commentData) {
  return connection("comments").insert(commentData).returning("*");
};

const fetchComments = function (article_id, sorted_by) {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id: article_id })
    .orderBy(sorted_by || "created_at", "desc");
};

module.exports = { postCommentToArticles, fetchComments };
