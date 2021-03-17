const express = require("express");
const updateCommentVotes = require("../Controllers/commentsController");
const { methodNotAllowed } = require("../Errors/index");
const commentsRouter = express.Router();

commentsRouter.patch("/:comment_id", updateCommentVotes);

commentsRouter.all("/", methodNotAllowed);

module.exports = commentsRouter;
