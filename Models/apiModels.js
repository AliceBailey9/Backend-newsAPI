const fs = require("fs");

const getJsonEndpoints = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./endpoints.json", "utf8", (err, endpoints) => {
      if (err) {
        reject(err);
      } else {
        resolve(endpoints);
      }
    });
  });
};

module.exports = getJsonEndpoints;
