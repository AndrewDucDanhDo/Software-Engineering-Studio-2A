import { translateToQuCircuit, translateToSimulator } from "../quantumSimulator/quantumTranslator";
import { solveQuantumCircuit } from "../quantumSimulator/quantumSolver";

/**
 * A generic data structure that can be used to interact with the circuit.
 *
 * It provides a level of abstraction for storing and reading circuits, that means you can still interact with the circuit
 * regardless whatever format the circuit is stored in.
 *
 * This class is immutable which is more convenient when using React states. It's internal values however, are not immutable.
 *
 * @example Saving circuit to the backend.
 * const circuitStructure = useContext(CircuitStructureContext);
 * let circuit = circuitStructure.getStoredCircuit();
 * let res = await api.user.circuit.create("someToken", circuit);
 * // Remember to handle errors from res here!
 */
export class CircuitStructure {

	static CellCount = 25;
	static MaxWires = 8;
	static MinWires = 2;
	static AllowedCircuitInputs = ["0", "1"];

	constructor(circuit, inputs) {
		this._inputs = inputs || [];
		this._wireCount = Math.max(CircuitStructure.MinWires, Math.min(CircuitStructure.MaxWires, this._inputs.length));
		// The internal structure is always guaranteed to be a 2D array.
		this.internalStructure = circuit || createInternalCircuitStructure(this.wireCount);
	}

	static createDefault() {
		return this.create(this.MinWires);
	}

	static create(wireCount) {
		let safeWireCount = Math.max(CircuitStructure.MinWires, Math.min(CircuitStructure.MaxWires, wireCount));

		return new CircuitStructure(
			createInternalCircuitStructure(safeWireCount),
			new Array(safeWireCount).fill(this.AllowedCircuitInputs[0])
		);
	}

	/**
	 * Create a new circuit with the desired inputs.
	 * @param {*[]} inputs
	 * @return {CircuitStructure}
	 */
	static createWithInputs(inputs) {
		return new CircuitStructure(
			new Array(inputs.length)
				.fill(null)
				.map((e) => new Array(this.CellCount)),
			inputs);
	}

	/**
	 * Create a new circuit from stored data.
	 * @param circuitData
	 * @return {CircuitStructure}
	 */
	static fromStored(circuitData) {
		let [translatedCircuit, inputs] = translateToQuCircuit(
			circuitData,
			CircuitStructure.CellCount
		);
		return new CircuitStructure(translatedCircuit, inputs);
	}

	/**
	 * @param {CircuitStructure} otherCircuit
	 */
	mergeWith(otherCircuit) {
		let circuit = this.copy();

		for (let i = 0; i < this._wireCount; i++) {
			if (otherCircuit.internalStructure[i]) {
				for (let j = 0; j < CircuitStructure.CellCount; j++) {
					circuit.internalStructure[i][j] = otherCircuit.internalStructure[i][j];
				}
			}
		}
		return circuit;
	}

	/**
	 * @returns {*[]} The results you would get from the circuit.
	 */
	async calculateResults() {
		return await solveQuantumCircuit(this.getStoredCircuit());
	}

	/**
	 * @returns {*[]} The qubit inputs that the user has inserted.
	 */
	get inputs() {
		return this._inputs;
	}

	/**
	 * @returns {boolean} true if the circuit contains no placed gates.
	 */
	get isEmpty() {
		return false;
	}

	/**
	 * @returns {number}
	 */
	get wireCount() {
		return this._wireCount;
	}

	/**
	 * @returns {Object} A structure of the circuit that is safe to be stored in file or sent to the backend.
	 */
	getStoredCircuit() {
		if (this.internalStructure.length > 0) {
			return {
				...translateToSimulator(this.internalStructure, this._inputs),
				input: this._inputs,
				version: 1,
			};
		} else {
			return {
				gates: [],
				circuit: [],
				input: this._inputs,
				version: 1,
			};
		}
	}

	/**
	 * Automatically run a user download of the current circuit from the browser.
	 */
	runUserDownload() {
		const blob = new Blob([JSON.stringify(this.getStoredCircuit())]);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "circuit.json";
		a.click();
	}

	/**
	 * Convenience function for getting a copy. Useful when trying to update React state.
	 * @return {CircuitStructure}
	 */
	copy() {
		return new CircuitStructure(this.internalStructure, this.inputs);
	}

	/**
	 * Create a new circuit structure copy with the new inputs.
	 * @param {*[]} newInputs
	 * @return {CircuitStructure}
	 */
	setInputs(newInputs) {
		return new CircuitStructure(this.internalStructure, newInputs);
	}

	/**
	 * Create a new circuit structure copy with the new wire count.
	 * @param {Number} newWireCount
	 * @return {CircuitStructure}
	 */
	setWireCount(newWireCount) {
		return CircuitStructure.create(newWireCount).mergeWith(this);
	}
}

/**
 * A helper function for creating the internal format of {@link CircuitStructure}
 * @param {Number} wireCount
 */
export function createInternalCircuitStructure(wireCount) {
	// Why not just do .fill(new Array())? well that's because it will only create a single shared array.
	return new Array(wireCount)
		.fill(null)
		.map((e) => new Array(CircuitStructure.CellCount));
}