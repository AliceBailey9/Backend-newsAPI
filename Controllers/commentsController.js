const {
  updateTheCommentVotes,
  doesCommentExist,
  deleteCommentById,
} = require("../Models/commentsModels");

const updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    updateTheCommentVotes(comment_id, inc_votes),
    doesCommentExist(comment_id),
  ])
    .then((comment) => {
      res.status(200).send({ comment: comment[0][0] });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([deleteCommentById(comment_id), doesCommentExist(comment_id)])
    .then((response) => {
      res.status(204).send("hi");
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { updateCommentVotes, deleteComment };
