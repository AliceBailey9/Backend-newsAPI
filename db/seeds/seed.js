const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const addVotes = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex
        .insert(userData)
        .into("users")
        .returning("*")
        .then((addedUsers) => {
          return knex
            .insert(topicData)
            .into("topics")
            .returning("*")
            .then((topicData) => {
              const formattedArticleData = addVotes(articleData);
              return knex
                .insert(formattedArticleData)
                .into("articles")
                .returning("*");
            });
        });
    });
  // add seeding functionality here
};
