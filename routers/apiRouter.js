const express = require("express");
const topicsRouter = require("../routers/topicsRouter");
const usersRouter = require("../routers/usersRouter");
const articlesRouter = require("./articlesRouter");
const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/user", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
