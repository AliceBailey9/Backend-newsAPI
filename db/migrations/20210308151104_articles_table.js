exports.up = function (knex) {
  console.log("creating articles table ...");
  return knex.schema.createTable("articles", function (articlesTable) {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body").notNullable();
    articlesTable.integer("votes").notNullable();
    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("author").references("users.username");
    articlesTable.timestamp("created_at").notNullable();
  });
};

exports.down = function (knex) {
  console.log("removing articles table");
  return knex.schema.dropTable("articles");
};
