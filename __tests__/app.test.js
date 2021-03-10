process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const { response } = require("express");

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
      return request(app).get("/api/user/cheesecake").expect(404);
    });
  });
  // describe('articles', () => {
  //   it('get an article will return a article with the correct objec')
  // })
});

//user could request non exisitant username
