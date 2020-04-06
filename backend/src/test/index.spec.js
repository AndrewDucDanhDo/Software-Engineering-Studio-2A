import request from "supertest";
import assert from "assert";

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

  it(" should be online", function (done) {
    request(server)
      .get("/")
      .expect(200, done);
  });

  it("should return Hello message (POC)", function (done) {
    request(server)
      .get("/")
      .expect(200)
      .end(function (err, res) {
        assert(res.body.msg.includes('Hello from quantum simulator API'));
        done();
      });
  });
});
