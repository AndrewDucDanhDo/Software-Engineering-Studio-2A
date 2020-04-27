const numeric = require("numeric"); // Need this dependency, there is behaviour I dont understand and it is too difficult to mock
const Application = require("../application.js");
import { expect } from "chai";
import sinon from "sinon";

/*
    NOTE: Uncovered coverage 
    Lines 53-57 is in a block that is impossible to run.
    This is part of the function compileAll() which doesn't seem to do anything. 
*/

describe("quantom-simulator", () => {
  describe("application", () => {
    var application;
    it("Should construct a new application", () => {
      application = new Application(2);

      expect(application.circuit.nqubits).to.equal(2);
    });

    it("Should load a circuit from a JSON", () => {
      application.loadWorkspace(require("./data/toffoli.json"));

      expect(application.circuit.nqubits).to.equal(3);
      expect(application.circuit.gates.length).to.equal(9);
      expect(application.workspace.app).to.equal(application);
    });

    it("Should apply a circuit", () => {
      const state = application.circuit.inputs.join("");
      const size = Math.pow(2, application.circuit.nqubits);
      const amplitudes = new numeric.T(
        numeric.rep([size], 0),
        numeric.rep([size], 0)
      );
      amplitudes.x[parseInt(state, 2)] = 1;

      application.applyCircuit(
        application.circuit,
        amplitudes,
        (final_amplitudes) => {
          expect(final_amplitudes).to.deep.equal(amplitudes);
        }
      );
    });

    it("Should load a circuit containing unknown gate", () => {
      application.loadWorkspace(require("./data/new-gate.json"));

      expect(application.circuit.nqubits).to.equal(1);
      expect(application.workspace.app).to.equal(application);
    });
  });
});
