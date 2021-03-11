const connection = require("../db/connection");

const postCommentToArticles = function (commentData) {
  return connection("comments").insert(commentData).returning("comments");
};

module.exports = postCommentToArticles;
