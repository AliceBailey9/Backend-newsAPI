const express = require("express");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const getAllEndpoints = require("../Controllers/apiController");
const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/user", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", getAllEndpoints);

module.exports = apiRouter;
