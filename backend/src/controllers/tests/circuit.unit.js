import request from "supertest";
import assert from "assert";
import sinon from "sinon";

var solve = require("../../controllers/circuit").solve;
var req = require("./data/req.json");

describe("!!!!!!!!!!", () => {
  beforeEach(() => {});

  afterEach(() => {});

  it("!!!!!!!!!!", function (done) {
    var res;
    res = {
      status: sinon.fake.returns(this),
      json: sinon.fake()
    };

    res.status();

    // solve(req, res);
    // assert(res.status.);
    // console.log(res.status.firstArg);
    done();
  });
});
