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

const updateTheCommentVotes = function (comment_id, inc_votes) {
  return connection("comments")
    .where({ comment_id: comment_id })
    .modify((querySoFar) => {
      if (inc_votes) {
        querySoFar.increment({ votes: inc_votes });
        querySoFar.returning("*");
      } else {
        querySoFar.returning("*");
      }
    });
};

const doesCommentExist = function (comment_id) {
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id: comment_id })
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment not found for comment_id: ${comment_id}`,
        });
      }
    });
};

module.exports = {
  postCommentToArticles,
  fetchComments,
  updateTheCommentVotes,
  doesCommentExist,
};
