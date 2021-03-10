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
    describe("GET requests", () => {
      it("get an array of all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            const topicsResponse = response.body;
            expect(topicsResponse.topics).toEqual(expect.any(Array));
            expect(Object.keys(topicsResponse.topics[0])).toEqual(
              expect.arrayContaining(["description", "slug"])
            );
            expect(topicsResponse.topics[0]).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
      });
    });
  });
});
