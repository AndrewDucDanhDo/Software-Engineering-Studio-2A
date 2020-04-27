import request from "supertest";
import { expect } from "chai";


describe("GET /", () => {
    var server;

    beforeEach(() => {
        // We will create a new instance of the server for each test
        server = require("../../index");
    });

    afterEach(() => {
        // Make sure to stop the process when not needed
        server.close();
    });

    var circuit = require('./data/toffoli.json');
    let nqubits = 3;
    for (let i = 0; i < nqubits ** 2 - 1; i++) {
        for (let j = 0; j < nqubits; j++) {
            circuit.input[j] = ((i & (1 << j)) >> j);
        }

        // Mock expected result. If first two states ON, invert the last state. Otherwise output initial state.
        var expectedState
        if (circuit.input[0] && circuit.input[1]) {
            expectedState = "11" + (circuit.input[2] ? "0" : "1");
        } else {
            expectedState = circuit.input.join("");
        }

        it(`Should solve toffoli circuit for ${circuit.input.join("")} expect ${expectedState}`, function (done) {
            request(server).post("/circuit/solve").send(circuit).expect(200)
                .end(function (err, res) {
                    // Loop through each final output, find possible
                    var count = 0;
                    res.body.results.forEach(function (output) {
                        if (output.impossible == false) {
                            expect(output.state).to.equal(expectedState);
                            expect(output.value).to.equal("100.0000%");
                            count++;
                        }
                    });
                    expect(count).to.equal(1);
                    done();
                });
        });
    }
});