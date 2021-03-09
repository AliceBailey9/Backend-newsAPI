const {
  topicData,
  articleData,
  commentData,
  userData,
  renameKey
} = require("../data/index.js");

const {formatTime, createRef, formatData} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(userData).into("users").returning("*");
    })
    .then((addedUsers) => {
      return knex.insert(topicData).into("topics").returning("*");
    })
    .then((addedTopics) => {
      const formattedArticleData = formatTime(articleData)
      return knex.insert(formattedArticleData).into("articles").returning("*");
    })
    .then((addedArticles)=>{
      let commentsWithTimestamp = formatTime(commentData)
      let refObj = createRef(addedArticles, 'title', 'article_id')
      let formattedComments = formatData(commentsWithTimestamp, refObj, 'belongs_to', 'article_id')
      
      return knex.insert(formattedComments).into('comments')

    })
  // add seeding functionality here
};
