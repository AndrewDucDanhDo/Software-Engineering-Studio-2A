import request from "supertest";
import { expect } from "chai";

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
    request(server).get("/").expect(200, done);
  });

  it("should return Hello message (POC)", function (done) {
    request(server)
      .get("/")
      .expect(200)
      .end(function (err, res) {
        expect(res.body.msg).to.include("Hello from quantum simulator API");
        done();
      });
  });
});

describe("POST /circuit/solve", () => {
  var server;
  var adder = require("./data/adder.json");

  beforeEach(() => {
    // We will create a new instance of the server for each test
    server = require("../index");
  });

  afterEach(() => {
    // Make sure to stop the process when not needed
    server.close();
  });

  it("should POST a circuit", function (done) {
    request(server).post("/circuit/solve").send(adder).expect(200, done);
  });

  it("should solve 1 + 0", function (done) {
    adder.input = [1, 0, 0, 0];
    request(server)
      .post("/circuit/solve")
      .send(adder)
      .expect(200)
      .end(function (err, res) {
        // Loop through each final output, find possible
        res.body.results.forEach(function (output) {
          if (output.impossible == false) {
            expect(output.state).to.equal("1010");
          }
        });
      });
    done();
  });

  it("should solve 1 + 1", function (done) {
    adder.input = [1, 1, 0, 0];
    request(server)
      .post("/circuit/solve")
      .send(adder)
      .expect(200)
      .end(function (err, res) {
        // Loop through each final output, find possible
        res.body.results.forEach(function (output) {
          if (output.impossible == false) {
            expect(output.state).to.equal("1101");
          }
        });
      });
    done();
  });
});
