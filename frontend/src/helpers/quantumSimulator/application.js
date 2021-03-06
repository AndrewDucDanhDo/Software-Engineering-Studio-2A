import Circuit from "./circuit";
import Workspace from "./workspace";
import numeric from "numeric"

export default class Application {
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
	Load a new workspace in from a json object, overwriting the current one.
	JSON struct looks like:
	{
		"circuit": [
			{"type": "h", "time": 0, "targets": [0], "controls": []},
			{"type": "x", "time": 1, "targets": [1], "controls": [0]}
		],
		"qubits": 2,
		"input": [0, 0]
	}
	And can also contain a "gates" property which is a list of the user defined
	gates in the circuit.
	*/
	loadWorkspace(json) {
		this.workspace = new Workspace(this);
		if (json.gates) {
			for (let i = 0; i < json.gates.length; i++) {
				const gate = json.gates[i];
				this.workspace.addGate({
					name: gate.name,
					qubits: gate.qubits,
					matrix: gate.matrix,
					fn: gate.fn,
					title: gate.title,
					circuit: Circuit.load(this, gate.qubits, gate.circuit)
				});
			}
		}
		this.circuit = Circuit.load(this, json.qubits, json.circuit);
		this.compileAll();
	}

	/*
	  Asynchronously compile every user defined gate in the workspace.
	  */
	compileAll() {
		const app = this;
		const todo = [];
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
			(percent) => {
			},
			(x) => {
				callback(x);
			}
		);
	}
};
