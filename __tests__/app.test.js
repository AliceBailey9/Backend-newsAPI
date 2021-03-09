process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const app = require("../app");
const request = require("supertest");

beforeEach(() => {
  return connection.seed.run();
});
afterAll(() => connection.destroy());

describe("/api", () => {
  describe("topics", () => {
    describe("GET requests", () => {
      it("get an array of all topics", () => {
        return request(app).get("/api/topics").expect(200);
      });
    });
  });
});
