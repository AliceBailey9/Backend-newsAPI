const express = require("express");
const updateCommentVotes = require("../Controllers/commentsController");
const commentsRouter = express.Router();

commentsRouter.patch("/:comment_id", updateCommentVotes);

module.exports = commentsRouter;
