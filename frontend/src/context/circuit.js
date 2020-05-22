import React, { createContext, useState } from "react";

// TODO Implement proper functionality.
/**
 * A level of abstraction for storing and reading circuits.
 *
 * Here's the motivation, the person trying to store or load a circuit should not care what format the circuit is in.
 * All the person should care about is what to do with the circuit, whether it is loading or saving. This abstraction
 * provides this.
 */
export class CircuitStructure {

    constructor(circuit, inputs) {
        this._internalStructure = circuit || {};
        this._inputs = inputs || [];
    }

    /**
     * @returns {*[]} The results you would get from the circuit.
     */
    calculateResults() {
        return [];
    }

    get inputs() {
        return this._inputs;
    }

    /**
     * @returns {boolean} true if the circuit contains no placed gates.
     */
    get isEmpty() {
        return false;
    }

    get wireCount() {
        return -1;
    }

    /**
     * @returns {{}} A structure of the circuit that is safe to be stored in file or sent to the backend.
     */
    getStored() {
        return {
            gates: [],
            circuit: [],
            qubits: [],
            input: this._inputs,
            version: 1
        };
    }
}

/**
 * A way to set new values onto the circuit.
 *
 * Why is this a class? It is useful to have some convenient functions when trying to update the circuit.
 * Also it's more scalable. If there are any other values that is related to the circuit, we can have another {@link React.Context}
 * while using this as a simple way to set things.
 */
export class CircuitSetter {

    constructor(circuitStructureSetter, circuitResultsSetter) {
        this._circuitStructureSetter = circuitStructureSetter || (function() {});
        this._circuitResultsSetter = circuitResultsSetter || (function() {});
    }

    setCircuitStructure(circuitStructure) {
        this._circuitStructureSetter(circuitStructure);
    }

    setCircuitResults(results) {
        this._circuitResultsSetter(results);
    }

    updateResultsFromCircuit() {
        // TODO do some computation on the circuit and call setCircuitResults(results)
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
    const [circuitSetter] = useState(new CircuitSetter(setCircuitStructure, setCircuitResults));

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