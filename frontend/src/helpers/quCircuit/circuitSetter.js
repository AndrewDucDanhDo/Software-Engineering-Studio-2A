import { CircuitStructure } from "./circuitStructure";

/**
 * A way to set new values onto the circuit.
 *
 * Why is this a class? It is useful to have some convenient functions when trying to update the circuit.
 * Also it's more scalable. If there are any other values that is related to the circuit, we can have another {@link React.Context}
 * while using this as a simple way to set things.
 *
 * @example Loading circuit from the backend
 * const circuitSetter = useContext(CircuitSetterContext);
 * let res = await api.user.circuit.getSingle("someToken", "someUserId", "someCircuitId");
 * // Remember to handle errors from res here!
 * circuitSetter.loadStoredCircuit(res.data);
 */
export class CircuitSetter {
	constructor(options = {}) {
		this._structureSetter = options.setCircuitStructure || function () {
		};
		this._resultsSetter = options.setCircuitResults || function () {
		};
	}

	/**
	 * @param {function(prevState: CircuitStructure): CircuitStructure | CircuitStructure} value
	 */
	setStructure(value) {
		this._structureSetter(value);
	}

	/**
	 * @param {function(prevState: *[]): *[] | *[]} value
	 */
	setResults(value) {
		this._resultsSetter(value);
	}

	/**
	 * @param {*[]} value
	 */
	setInputs(value) {
		this.setStructure(prevState => new CircuitStructure(prevState.internalStructure, value));
	}

	/**
	 * @param {Number} wireCount
	 */
	setWireCount(wireCount) {
		this.setStructure(prevState => prevState.setWireCount(wireCount))
	}

	clearStructure() {
		this.setStructure(prevState => CircuitStructure.createWithInputs(prevState.inputs))
	}

	/**
	 * @param {Object} circuitData Load the circuit based on the stored format, one that is used in the backend
	 */
	loadStoredCircuit(circuitData) {
		this.setStructure(CircuitStructure.fromStored(circuitData));
	}

	/**
	 * Automatically ask the user to upload a new circuit from the browser.
	 */
	userUploadCircuit() {
		// TODO do something and call this.setCircuitStructure
	}

	/**
	 * Calculate the results from the circuit and set {@link CircuitResultsContext}.
	 * @param {CircuitStructure} circuitStructure The current circuit structure fetched from {@link CircuitStructureContext}
	 */
	setResultsFromStructure(circuitStructure) {
		let results = circuitStructure.calculateResults();
		this.setResults(results);
	}
}