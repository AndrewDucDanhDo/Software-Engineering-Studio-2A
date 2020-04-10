const Circuit = require("./circuit");
const Workspace = require("./workspace");
const numeric = require("numeric");

module.exports = class Application {
  constructor(nqubits) {
    const app = this;
    this.workspace = new Workspace(app);
    this.circuit = new Circuit(app, nqubits);
  }

  /*
    Set current "circuit" to that of some "gate" and update the interface
    for the new circuit.
    */
  editCircuit(gate) {
    this.circuit = gate.circuit;
    this.editor.resize(gate.circuit.nqubits, this.editor.length);
    document.querySelector("#nqubits > span").innerHTML =
      "Qubits: " + this.circuit.nqubits;
    if (gate.input) {
      this.editor.input = gate.input;
    }
    this.editor.render();
  }

  /*
    Asynchronously compile every user defined gate in the workspace.
    */
  compileAll() {
    const app = this;
    const todo = [];
    const workspace = this.workspace;
    document.querySelectorAll("#toolbar .user div.gate").forEach((el) => {
      const type = workspace.gates[el.dataset.type];
      if (!type.matrix) {
        todo.push(type);
      }
    });
    const loop = (i) => {
      if (i < todo.length) {
        const n = Math.pow(2, todo[i].circuit.nqubits);
        const I = new numeric.T(numeric.identity(n), numeric.rep([n, n], 0));
        app.applyCircuit(todo[i].circuit, I, (U) => {
          todo[i].matrix = U;
          setTimeout(() => loop(i + 1), 1);
        });
      }
    };
    loop(0);
  }

  /*
    Applies circuit to matrix and passes result to callback
    */
  applyCircuit(circuit, x, callback) {
    circuit.evaluate(
      x,
      (percent) => {},
      (x) => {
        callback(x);
      }
    );
  }
};
