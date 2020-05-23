import React, { createContext, useState } from "react";

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
        return {
            gates: [],
            circuit: [],
            qubits: [],
            input: this._inputs,
            version: 1
        };
    }

    /**
     * Automatically run a user download of the current circuit from the browser.
     */
    userDownloadCircuit() {

    }
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
        this._circuitStructureSetter = options.circuitStructureSetter || (function() {});
        this._circuitResultsSetter = options.circuitResultsSetter || (function() {});
        // Note: you're not suppose to touch the values below unless you are in this class. Use another useContext instead.
        this._circuitStructure = options.circuitStructure;
        this._circuitResults = options.circuitResults;
    }

    /**
     * @param {function(prevState: CircuitStructure): CircuitStructure | CircuitStructure} value
     */
    setCircuitStructure(value) {
        this._circuitStructureSetter(value);
    }

    /**
     * @param {function(prevState: *[]): *[] | *[]} value
     */
    setCircuitResults(value) {
        this._circuitResultsSetter(value);
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
     */
    updateResultsFromCircuit() {
        let results = this._circuitStructure.calculateResults();
        this._circuitResultsSetter(results);
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
    const [circuitStructure, setCircuitStructure] = useState(new CircuitStructure());
    const [circuitResults, setCircuitResults] = useState([]);
    const [circuitSetter] = useState(new CircuitSetter({
        circuitStructure, setCircuitStructure,
        circuitResults, setCircuitResults
    }));

    return (
        <CircuitSetterContext.Provider value={circuitSetter}>
            <CircuitStructureContext.Provider value={circuitStructure}>
                <CircuitResultsContext.Provider value={circuitResults}>
                    {props.children}
                </CircuitResultsContext.Provider>
            </CircuitStructureContext.Provider>
        </CircuitSetterContext.Provider>
    )
}