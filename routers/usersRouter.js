const express = require("express");
const getUser = require("../Controllers/usersControllers");
const usersRouter = express.Router();

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
