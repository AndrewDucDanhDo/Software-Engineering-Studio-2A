import Application from "./application";
import numeric from "numeric";

function processAmplitudes(nqubits, amplitudes) {
	let results = [];

	for (let i = 0; i < amplitudes.x.length; i++) {
		let amplitude = "";
		let state = "";

		for (let j = 0; j < nqubits; j++) {
			state = ((i & (1 << j)) >> j) + state;
		}
		amplitude += amplitudes.x[i].toFixed(8);
		amplitude += amplitudes.y[i] < 0 ? '-' : '+';
		amplitude += Math.abs(amplitudes.y[i]).toFixed(8) + 'i';
		let prob = Math.pow(amplitudes.x[i], 2);
		prob += Math.pow(amplitudes.y[i], 2);
		const probability = (prob * 100).toFixed(4);
		results.push({amplitude: amplitude, state: state, probability: probability})
	}

	return results;
}

export async function solveQuantumCircuit(circuit) {
	return new Promise((resolve) => {
		let nqubits = circuit.qubits;
		let app = new Application(nqubits);
		app.loadWorkspace(circuit);
		app.circuit.gates.sort((a, b) => a.time - b.time);
		const size = Math.pow(2, app.circuit.nqubits);
		const amplitudes = new numeric.T(
			numeric.rep([size], 0),
			numeric.rep([size], 0)
		);
		const state = circuit.input.join('');
		amplitudes.x[parseInt(state, 2)] = 1;
		app.applyCircuit(app.circuit, amplitudes, amplitudes => {
			resolve(processAmplitudes(nqubits, amplitudes.div(amplitudes.norm2())))
			// displayAmplitudes(app.circuit.nqubits, amplitudes.div(amplitudes.norm2()))
		});
	});
}