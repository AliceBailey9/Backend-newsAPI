const { fetchUser } = require("../Models/usersModels");

const getUser = function (req, res, next) {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getUser;
