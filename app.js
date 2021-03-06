const express = require("express");
const apiRouter = require("./routers/apiRouter");
const {
  handleCustomErrors,
  handleServerErrors,
  psqlErrors,
} = require("./Errors/index");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(psqlErrors);
app.use(handleServerErrors);

module.exports = app;
