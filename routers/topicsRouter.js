const express = require("express");
const getTopics = require("../Controllers/topicsControllers");
const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
