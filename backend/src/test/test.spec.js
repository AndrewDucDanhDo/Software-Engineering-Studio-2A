const app = require("../index.js");
var request = require('supertest');
var assert = require('assert');


describe('GET /hello-world', function () {
  it('should run', function () {
    assert.equal(1, 1)
  });
  it('it responds with ', function (done) {
    request(app).get('/').expect(200).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
});
