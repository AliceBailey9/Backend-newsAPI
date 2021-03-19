process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const { response } = require("express");
const articlesRouter = require("../routers/articlesRouter");

beforeEach(() => {
  return connection.seed.run();
});
afterAll(() => connection.destroy());

describe("/api", () => {
  describe("topics", () => {
    it(" get all topics returns an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topicsResponse = response.body;
          expect(topicsResponse.topics).toEqual(expect.any(Array));
          expect(topicsResponse.topics[0]).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
    });
    it("405 status code when wrong method used", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("users", () => {
    it("get user by username will return correct user object", () => {
      return request(app)
        .get("/api/user/butter_bridge")
        .expect(200)
        .then((response) => {
          const userResponse = response.body;
          expect(userResponse.user).toMatchObject({
            avatar_url: expect.any(String),
            name: "jonny",
            username: "butter_bridge",
          });
        });
    });
    it("get request with unknown username returns 404", () => {
      return request(app)
        .get("/api/user/cheesecake")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });
    it("405 status code when wrong method used", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/user")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("articles", () => {
    it("get article by article id will return correct article", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const articleResponse = response.body;
          expect(articleResponse.article).toMatchObject({
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            body:
              "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
    });
    it("get article will feature a comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const articleResponse = response.body;
          expect(articleResponse.article).toEqual(
            expect.objectContaining({
              comment_count: "13",
            })
          );
        });
    });
    it("recieve 404 when passed in a article number id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/98")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found for article_id: 98");
        });
    });
    it("recieve 400 when passed a non numerical article id", () => {
      return request(app)
        .get("/api/articles/oranges")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("patch request returns 200 status code and updated article", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          expect(response.body.updatedArticle).toMatchObject({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            body: expect.any(String),
            votes: 10,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2014-11-16T12:21:54.171Z",
          });
        });
    });
    it("patch request with empty body returns article without any update", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.body.updatedArticle).toMatchObject({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            body: expect.any(String),
            votes: 0,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2014-11-16T12:21:54.171Z",
          });
        });
    });
    it("recieve 400 when passed an invalid vote", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "cheese" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("recieve 404 when trying to patch an article with a valid id that doesnt exist yet", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 70 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Article not found for article_id: 99"
          );
        });
    });
    it("recieve 400 when passed an invalid article id", () => {
      return request(app)
        .patch("/api/articles/lemon")
        .send({ inc_votes: 12 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("post request returns 201 and responses with posted comment", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ author: "lurker", body: "Would have liked more details" })
        .expect(201)
        .then((response) => {
          expect(response.body.comment).toMatchObject({
            comment_id: 19,
            author: "lurker",
            article_id: 2,
            votes: 0,
            created_at: expect.any(String),
            body: "Would have liked more details",
          });
        });
    });
    it("if post request is sent without required keys (author or body), we receieve a 400", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ author: "lurker" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Bad request; missing comment content"
          );
        });
    });
    it("recieve 404 if post request is sent with valid id that doesnt exist", () => {
      return request(app)
        .post("/api/articles/98/comments")
        .send({ author: "lurker", body: "love this article, wow" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("This id does not exist");
        });
    });
    it("get comments by article id returns an array of comments", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.comments)).toBe(true);
          expect(response.body.comments[0]).toMatchObject({
            comment_id: 16,
            author: "butter_bridge",
            article_id: 6,
            votes: 1,
            created_at: "2002-11-26T12:36:03.389Z",
            body: "This is a bad article name",
          });
        });
    });
    it("get comments by article id returns an empty array when an article has no comments", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });

    it("recieve 404 when passed in an article id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/66/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Article not found for article_id: 66"
          );
        });
    });
    it("recieve 400 when passed in an invalid article id", () => {
      return request(app)
        .get("/api/articles/bluebells/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("get comments by article id is sorted by created_at by default and descending", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("get comments by article id accepts querys that change sorted order", () => {
      return request(app)
        .get("/api/articles/1/comments?sorted_by=votes")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    it("when get comments by article id is given a sort_by query that is invalid we recieve a 400", () => {
      return request(app)
        .get("/api/articles/1/comments?sorted_by=apples")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });

    it("get all articles returns array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.articles)).toBe(true);
          expect(response.body.articles[2]).toMatchObject({
            article_id: 3,
            author: "icellusedkars",
            created_at: "2010-11-17T12:21:54.171Z",
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            votes: 0,
            comment_count: "0",
          });
        });
    });
    it("get all articles is sorted by created_at and in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("get 405 status code when wrong method used", () => {
      return request(app)
        .delete("/api/user")
        .expect(405)
        .then((response) => {
          expect(response.body.msg).toBe("method not allowed");
        });
    });
    it("get all articles accepts sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    it("when passed get all articles an invalid sort_by query, recieve 400", () => {
      return request(app)
        .get("/api/articles?sort_by=spiders")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("get all articles accepts query changing order to ascending", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });
    it("get all articles accepts an author query, that will filter articles by username", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then((response) => {
          expect(response.body.articles.length).toBe(3);
        });
    });
    it("recieve 404 when given an author username that doesn't exist", () => {
      return request(app)
        .get("/api/articles?author=bananarama")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Username not found");
        });
    });
    it("get all articles accepts a topics query, that will filter articles by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          expect(response.body.articles.length).toBe(11);
        });
    });
    it("get all articles accepts mulitple queries a once", () => {
      return request(app)
        .get("/api/articles?author=rogersop&topic=cats")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toMatchObject({
            article_id: 5,
            author: "rogersop",
            created_at: expect.any(String),
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            votes: 0,
            comment_count: "2",
          });
        });
    });
  });
  describe("comments", () => {
    it("patch votes will increment votes by amount passed in body", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 70 })
        .expect(200)
        .then((response) => {
          expect(response.body.comment).toMatchObject({
            comment_id: 2,
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            article_id: 1,
            author: "butter_bridge",
            votes: 84,
            created_at: expect.any(String),
          });
        });
    });
    it("if patch body is empty return comment without the votes updated", () => {
      return request(app)
        .patch("/api/comments/2")
        .expect(200)
        .send({})
        .then((response) => {
          expect(response.body.comment).toMatchObject({
            comment_id: 2,
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            article_id: 1,
            author: "butter_bridge",
            votes: 14,
            created_at: expect.any(String),
          });
        });
    });
    it("recieve a 400 when passed an invalid vote body", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "bananas" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("recieve a 404 when passed a comment id that does exist yet", () => {
      return request(app)
        .patch("/api/comments/200")
        .send({ inc_votes: 10 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            `Comment not found for comment_id: 200`
          );
        });
    });
    it("recieve a 400 when an invalid comment id is given", () => {
      return request(app)
        .patch("/api/comments/cheesy")
        .send({ inc_votes: 2 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("get 405 status code when wrong method used", () => {
      const invalidMethods = ["get", "put"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/comments")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("delete comment by id", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("recieve 400 when passed an invalid id", () => {
      return request(app)
        .delete("/api/comments/dogs")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not valid");
        });
    });
    it("recieve a 404 when passed an id that doesn't exist yet", () => {
      return request(app)
        .delete("/api/comments/392")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            `Comment not found for comment_id: 392`
          );
        });
    });
  });

  //if one query is wrong
  //if more than one aarticle is sent back its send as an array else just one is send back as an object
});
