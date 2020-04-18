const Workspace = require("../workspace.js");
var gates = require("./data/gates.json");
import { expect } from "chai";
import sinon from "sinon";

describe("quantom-simulator", () => {
    describe("workspace", () => {
        var workspace
        it("Should initialise standard gates", () => {
            var app;
            workspace = new Workspace(app);

            var gate = workspace.gates["h"];
            expect(gate.name).to.equal("h");
            expect(gate.qubits).to.equal(1);
            expect(gate.title).to.equal("Hadamard");
        });
    });
});