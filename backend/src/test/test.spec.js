import request from "supertest";

describe("GET /", () => {
  var server;

  beforeEach(() => {
    // We will create a new instance of the server for each test
    server = require("../index");
  });

  afterEach(() => {
    // Make sure to stop the process when not needed
    server.close();
  });

  it("Check the server is online ", function (done) {
    request(app).get("/").expect(200, done);
  });
});
