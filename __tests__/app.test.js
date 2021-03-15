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
    it("get an array of all topics", () => {
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
    it("get 405 status code when wrong method used", () => {
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
    it("get user by username will return a user object with correct props", () => {
      return request(app)
        .get("/api/user/butter_bridge")
        .expect(200)
        .then((response) => {
          const userResponse = response.body;
          expect(Array.isArray(userResponse.user)).toBe(true);
          expect(userResponse.user[0]).toMatchObject({
            avatar_url: expect.any(String),
            name: expect.any(String),
            username: expect.any(String),
          });
        });
    });
    it("if get request with an unknown username", () => {
      return request(app)
        .get("/api/user/cheesecake")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });
    it("get 405 status code when wrong method used", () => {
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
    it("get article will return an article with the correct object", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const articleResponse = response.body;
          expect(Array.isArray(articleResponse.article)).toBe(true);
          expect(articleResponse.article[0]).toMatchObject({
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
          expect(articleResponse.article[0]).toEqual(
            expect.objectContaining({
              comment_count: "13",
            })
          );
        });
    });
    it("get 404 when passed in a article number id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/98")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found for article_id: 98");
        });
    });
    it("get 400 when passed a non numerical article id", () => {
      return request(app)
        .get("/api/articles/oranges")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request; input is not a valid");
        });
    });
    it("patch request returns 200 status code and updated article", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          expect(response.body.updatedArticle[0]).toMatchObject({
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
    it("get 400 when passed an invalid vote", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "cheese" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not a valid");
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
            created_at: null,
            body: "Would have liked more details",
          });
        });
    });
    it("if post request is sent without needed keys (author or body), we receieve a 400", () => {
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
    it("get comments by article id returns an array including correct comment objects", () => {
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

    it("get 404 when passed in an article id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/66/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Article not found for article_id: 66"
          );
        });
    });
    it("get 400 when passed in an invalid article id", () => {
      return request(app)
        .get("/api/articles/bluebells/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not a valid");
        });
    });
    it("get comments by article id is sorted by created_at by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("created_at");
        });
    });
    it("get comments by article id accepts querys that change sorted order", () => {
      return request(app)
        .get("/api/articles/1/comments?sorted_by=votes")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("votes");
        });
    });
    it("when get comments by article id is given a sort_by query that is invalid we recieve a 400", () => {
      return request(app)
        .get("/api/articles/1/comments?sorted_by=apples")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request; input is not a valid");
        });
    });

    it("get all articles returns array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          console.log(response.body.articles);
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
          expect(response.body.msg).toBe("Bad request; input is not a valid");
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
    // it("get all articles accepts an author query, that will filter authors by username", () => {
    //   return request(app)
    //     .get("/api/articles?author=rogersop")
    //     .expect(200)
    //     .then((response) => {
    //       console.log(response.body.article);
    //       expect(response.body.articles.length).toBe(3);
    //     });
    // });
  });
});
