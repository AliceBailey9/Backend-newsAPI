const express = require("express");
const {
  handleCustomErrors,
  handleServerErrors,
  psqlErrors,
  methodNotAllowed,
} = require("../Errors/index");
const getTopics = require("../Controllers/topicsControllers");
const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

topicsRouter.all("/", methodNotAllowed);

module.exports = topicsRouter;
