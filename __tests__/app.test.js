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
  });
  describe("users", () => {
    it("get a user will return a user object with correct props", () => {
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
  });
  describe("articles", () => {
    it("get an article will return a article with the correct object", () => {
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
    it("an article with a comment will feature a comment count", () => {
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
    it("get 404 when passed in a number id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/98")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found for article_id: 98");
        });
    });
    it("get 400 when passed a non numerical id", () => {
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
          expect(response.body.updatedArticle[0].votes).toBe(10);
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
    it("get comments by article ID returns correct comment object", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then((response) => {
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
    // it('get comments by article id is sorted by created_at by default', () => {
    //   return request(app)
    //   .get('/api/articles/5')

    // })
  });
});
//user could request non exisitant username

// {
//   body: 'This is a bad article name',
//   belongs_to: 'A',
//   created_by: 'butter_bridge',
//   votes: 1,
//   created_at: 1038314163389,

// }
