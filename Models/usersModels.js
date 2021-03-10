const connection = require("../db/connection");

const fetchUser = function (username) {
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where({ username: username })
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
      return user;
    });
};

module.exports = fetchUser;
