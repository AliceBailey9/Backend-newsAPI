\c nc_news



SELECT articles.article_id, COUNT(comment_id) AS comment_count FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id

-- SELECT * FROM topics;
-- SELECT * FROM users;
SELECT * FROM articles;
SELECT * FROM comments;

