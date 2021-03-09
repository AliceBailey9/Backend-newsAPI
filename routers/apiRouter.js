const express = require("express");
const topicsRouter = require("../routers/topicsRouter");
const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
