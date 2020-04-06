import request from "supertest";
import assert from "assert";

var adder = require('./circuits/adder.js')

describe("POST /circuit/solve", () => {
    var server;

    beforeEach(() => {
        // We will create a new instance of the server for each test
        server = require("../index");
    });

    afterEach(() => {
        // Make sure to stop the process when not needed
        server.close();
    });

    it("should POST a circuit", function (done) {
        request(server)
            .post("/circuit/solve")
            .send(adder)
            .expect(200, done);
    });

    it("should solve 1 + 0", function (done) {
        adder.input = [1, 0, 0, 0]
        request(server)
            .post("/circuit/solve")
            .send(adder)
            .expect(200, done);
    });
});
