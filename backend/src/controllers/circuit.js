const quantumSimulator = require("../helpers/quantom-simulator/application");
const quantumParser = require("../helpers/quantom-solver/parser");
const numeric = require("numeric");

export function solve(req, res) {
  const circuit = req.body;
  const nqubits = circuit.qubits;
  const state = circuit.input.join("");
  const app = new quantumSimulator(nqubits);

  app.circuit.gates.sort((a, b) => a.time - b.time);
  const size = Math.pow(2, app.circuit.nqubits);
  const amplitudes = new numeric.T(
    numeric.rep([size], 0),
    numeric.rep([size], 0)
  );
  amplitudes.x[parseInt(state, 2)] = 1;

  app.applyCircuit(app.circuit, amplitudes, (amplitudes_y) => {
    const results = quantumParser.parseAmplitudes(
      app.circuit.nqubits,
      amplitudes_y
    );
    res.json({
      results
    });
  });
}
