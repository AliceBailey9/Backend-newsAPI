const express = require("express");
const getUser = require("../Controllers/usersControllers");
const {
  handleCustomErrors,
  handleServerErrors,
  psqlErrors,
  methodNotAllowed,
} = require("../Errors/index");
const usersRouter = express.Router();

usersRouter.get("/:username", getUser);

usersRouter.all("/", methodNotAllowed);
module.exports = usersRouter;
