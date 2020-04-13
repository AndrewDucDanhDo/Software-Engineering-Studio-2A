import { solve } from "../circuit";
import { expect } from "chai";
import httpMocks from "node-mocks-http";

const reqData = {
  correct: require("./data/req.json"),
  incorrect: {}
};

describe("circuit controller", () => {
  it("Should return a 200 with correct request", () => {
    // Setup our mocks
    const mockReq = httpMocks.createRequest({
      method: "POST",
      url: "/circuit/solve",
      body: reqData.correct
    });
    const mockRes = httpMocks.createResponse();

    // Call our route
    solve(mockReq, mockRes);

    // Evaluate the results using our mocks
    expect(mockRes._getStatusCode()).to.equal(200);
  });

  it("Should return an error with bad data", () => {
    // Setup our mocks
    const mockReq = httpMocks.createRequest({
      method: "POST",
      url: "/circuit/solve",
      body: reqData.incorrect
    });
    const mockRes = httpMocks.createResponse();

    // Call our route with our mock objects
    solve(mockReq, mockRes);

    // Evaluate the results using our mocks
    expect(mockRes._getStatusCode()).to.equal(500);
    expect(mockRes._getJSONData()).to.deep.equal({
      msg: "An unknown error occurred while trying to solve the circuit.",
      error: "TypeError: Cannot read property 'join' of undefined"
    });
  });
});
