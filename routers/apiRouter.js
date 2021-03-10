const express = require("express");
const topicsRouter = require("../routers/topicsRouter");
const usersRouter = require("../routers/usersRouter");
const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/user", usersRouter);

module.exports = apiRouter;
