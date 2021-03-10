const getUser = function (req, res, next) {
  const { username } = req.body;
  console.log(username);
  res
    .status(200)
    .send("hi")

    .catch((err) => {
      next(err);
    });
};

module.exports = getUser;
