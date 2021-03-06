const ENV = process.env.NODE_ENV || "development";
const testData = require("./test-data/index");
const devData = require("./development-data/index");

const data = {
  production: devData,
  development: devData,
  test: testData,
};

module.exports = data[ENV];
