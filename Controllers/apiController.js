const getJsonEndpoints = require("../Models/apiModels");

const getAllEndpoints = (req, res, next) => {
  getJsonEndpoints()
    .then((endpointData) => {
      res.status(200).send(endpointData);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getAllEndpoints;
