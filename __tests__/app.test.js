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
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
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
          expect(body.msg).toBe("oranges is not a valid article_id");
        });
    });
  });
});

//user could request non exisitant username
