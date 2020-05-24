import React, { createContext, useState } from "react";
import { translateToSimulator } from "../helpers/quantumSimulator/quantumTranslator";

// TODO Implement proper functionality.
/**
 * A level of abstraction for storing and reading circuits.
 *
 * Here's the motivation, the person trying to store or load a circuit should not care what format the circuit is in.
 * All the person should care about is what to do with the circuit, whether it is loading or saving. This abstraction
 * provides this.
 *
 * @example Saving circuit to the backend.
 * const circuitStructure = useContext(CircuitStructureContext);
 * let circuit = circuitStructure.getStoredCircuit();
 * let res = await api.user.circuit.create("someToken", circuit);
 * // Remember to handle errors from res here!
 */
export class CircuitStructure {
	constructor(circuit, inputs, wireCount) {
		this._internalStructure = circuit || {};
		this._inputs = inputs || [];
		this._wireCount = wireCount || 1;
	}

	/**
	 * @returns {*[]} The results you would get from the circuit.
	 */
	calculateResults() {
		return [];
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
		if (this._internalStructure.length > 0) {
			return {
				...translateToSimulator(this._internalStructure, this._inputs),
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
	userDownloadCircuit() {}
}

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
		this._structureSetter = options.setCircuitStructure || function () {};
		this._resultsSetter = options.setCircuitResults || function () {};
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
	 * @param {Number} wireCount
	 */
	setWires(wireCount) {
		// TODO do something and call this.setCircuitStructure
	}

	/**
	 * @param {Object} circuitData Load the circuit based on the stored format, one that is used in the backend
	 */
	loadStoredCircuit(circuitData) {
		// TODO do something and call this.setCircuitStructure
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

/**
 * @summary A way to set new values to the current circuit.
 *
 * @description This is separated from {@link CircuitStructureContext} so that the React Context can re-render
 * consumers properly whenever the {@link CircuitStructureContext} changes without being interfered by this {@link CircuitSetterContext}.
 *
 * @see CircuitSetter
 * @type {React.Context<CircuitSetter>}
 */
export const CircuitSetterContext = createContext(new CircuitSetter());

/**
 * @summary A representation of the current circuit.
 *
 * @see CircuitStructure
 * @type {React.Context<CircuitStructure>}
 */
export const CircuitStructureContext = createContext(new CircuitStructure());

/**
 * @summary The current set of results that should be shown the the user.
 *
 * @description These may not be up to date to whatever results the current circuit has. However, it may be updated via
 * a button click or through some other methods.
 *
 * @type {React.Context<*[]>}
 */
export const CircuitResultsContext = createContext([]);

export function CircuitProvider(props) {
	const [circuitStructure, setCircuitStructure] = useState(
		new CircuitStructure()
	);
	const [circuitResults, setCircuitResults] = useState([]);
	const [circuitSetter] = useState(
		new CircuitSetter({
			circuitStructure,
			setCircuitStructure,
			circuitResults,
			setCircuitResults,
		})
	);

	return (
		<CircuitSetterContext.Provider value={circuitSetter}>
			<CircuitStructureContext.Provider value={circuitStructure}>
				<CircuitResultsContext.Provider value={circuitResults}>
					{props.children}
				</CircuitResultsContext.Provider>
			</CircuitStructureContext.Provider>
		</CircuitSetterContext.Provider>
	);
}
