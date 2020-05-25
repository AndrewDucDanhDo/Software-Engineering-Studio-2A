import React, { createContext, useState } from "react";
import { CircuitStructure } from "../helpers/quCircuit/circuitStructure";
import { CircuitSetter } from "../helpers/quCircuit/circuitSetter";

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
export const CircuitStructureContext = createContext(CircuitStructure.createDefault());

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
	const [circuitStructure, setCircuitStructure] = useState(CircuitStructure.createDefault());
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