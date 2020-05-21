const numeric = require("numeric"); // Need this dependency, there is behaviour I dont understand and it is too difficult to mock
const Circuit = require("../circuit.js");
var gates = require("./data/gates.json");
import { expect } from "chai";
import sinon from "sinon";

describe("quantom-simulator", () => {
  describe("circuit", () => {
    var circuit;
    var i = 0;

    it("Should load a circuit", () => {
      const app = sinon.fake();

      circuit = Circuit.load(app, 2, []);

      expect(circuit.app).to.deep.equal(app);
      expect(circuit.nqubits).to.equal(2);
    });

    it("Should add a gate", () => {
      var gate = {
        type: {
          name: gates[i].type
        },
        time: gates[i].time + 1,
        targets: gates[i].targets,
        controls: gates[i].controls
      };

      circuit.addGate(gate);

      expect(circuit.gates.length).to.equal(1);
      expect(circuit.gates[i]).to.deep.equal(gate);
    });

    it("Should convert toJSON", () => {
      delete gates[i].range;
      expect(circuit.toJSON()[0]).to.deep.equal(gates[i]);
    });

    it("Should copy", () => {
      const copy = circuit.copy();
      delete copy.gates[i].range;

      expect(copy).to.deep.equal(circuit);
    });

    it("Should remove gate", () => {
      circuit.removeGate(circuit.gates[0]);

      expect(circuit.gates.length).to.equal(0);
    });

    it("Should evaluate the circuit", () => {
      // construct initial state of |00>
      const amplitudes = new numeric.T(
        numeric.rep([4], 0),
        numeric.rep([4], 0)
      );
      amplitudes.x[0] = 1;
      // add gate with required complexity
      var gate = {
        type: {
          name: gates[0].type,
          qubits: 1,
          matrix: {
            x: [
              [0.7071067811865475, 0.7071067811865475],
              [0.7071067811865475, -0.7071067811865475]
            ],
            y: [
              [0, 0],
              [0, 0]
            ]
          }
        },
        time: gates[0].time + 1,
        targets: gates[0].targets,
        controls: gates[0].controls
      };
      circuit.addGate(gate);

      circuit.evaluate(
        amplitudes,
        (progess_percent) => {},
        (amplitude) => {
          expect(amplitude.x).to.deep.equal([
            0.7071067811865475,
            0,
            0.7071067811865475,
            0
          ]);
          expect(amplitude.y).to.deep.equal([0, 0, 0, 0]);
        }
      );
    });
  });
});
