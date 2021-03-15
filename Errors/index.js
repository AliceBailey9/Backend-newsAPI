const methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

const psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send({ msg: "Bad request; input is not a valid" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request; missing comment content" });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
  handleCustomErrors,
  handleServerErrors,
  psqlErrors,
  methodNotAllowed,
};
