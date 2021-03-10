const connection = require("../db/connection");

const fetchTopics = function () {
  return connection.select("description", "slug").from("topics");
};

module.exports = fetchTopics;
