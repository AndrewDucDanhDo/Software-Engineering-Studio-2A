import { solve } from "../circuit";
import { expect } from "chai";
import httpMocks from "node-mocks-http";
import sinon from "sinon";

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

  it("Should return an error with bad data (POC using sinon)", () => {
    // Setup our mocks
    const mockReq = {
      body: reqData.incorrect
    };
    const jsonMock = sinon.fake();
    const mockRes = {
      status: sinon.fake.returns({
        json: jsonMock
      })
    };

    // Call our route with our mock objects
    solve(mockReq, mockRes);

    // Evaluate the results using our mocks
    expect(mockRes.status.firstArg).to.equal(500);
    expect(jsonMock.firstArg).to.deep.equal({
      msg: "An unknown error occurred while trying to solve the circuit.",
      error: "TypeError: Cannot read property 'join' of undefined"
    });
  });

  it("(POC using sinon)", () => {
    // Setup our mocks
    const mockReq = {
      body: reqData.incorrect
    };
    const jsonMock = sinon.fake();
    const mockRes = {
      status: sinon.fake.returns({
        json: jsonMock
      })
    };

    // Call our route with our mock objects
    solve(mockReq, mockRes);

    // Evaluate the results using our mocks
    expect(mockRes.status.firstArg).to.equal(500);
    expect(jsonMock.firstArg).to.deep.equal({
      msg: "An unknown error occurred while trying to solve the circuit.",
      error: "TypeError: Cannot read property 'join' of undefined"
    });
  });
});
