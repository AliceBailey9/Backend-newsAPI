const { request } = require("express");
const express = require("express");
const apiRouter = require("./routers/apiRouter");
const {
  handleCustomErrors,
  handleServerErrors,
  psqlErrors,
} = require("./Errors/index");
const app = express();

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(psqlErrors);
app.use(handleServerErrors);

module.exports = app;
