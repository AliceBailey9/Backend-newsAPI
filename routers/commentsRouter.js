const express = require("express");
const {
  updateCommentVotes,
  deleteComment,
} = require("../Controllers/commentsController");
const { methodNotAllowed } = require("../Errors/index");
const commentsRouter = express.Router();

commentsRouter.patch("/:comment_id", updateCommentVotes);

commentsRouter.delete("/:comment_id", deleteComment);

commentsRouter.all("/", methodNotAllowed);

module.exports = commentsRouter;
