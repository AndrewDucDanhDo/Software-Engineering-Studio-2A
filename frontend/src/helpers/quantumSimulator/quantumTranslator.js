import { GateProperties, Gates } from "../quCircuit/gates";
import CellData from "../quCircuit/cellData";

class GateAliases {

    static ToSimulator = {};
    static FromSimulator = {};

    static addAlias(from, to) {
        this.ToSimulator[from] = to;
        this.FromSimulator[to] = from;
    }
}

GateAliases.addAlias(Gates.CNOT, "x");

export function translateToSimulator(circuit, circuitInputs) {
    const SimpleGatesFilter = [Gates.CONTROL, Gates.SWAP];

    let translatedCircuit = {
        gates: [],
        circuit: [],
        qubits: circuitInputs.length,
        input: circuitInputs.map(inp => isNaN(inp) ? 0 : parseInt(inp)),
        version: 1
    };
    const wireCount = circuit.length;
    const cellCount = circuit[0].length;

    for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
        let visitedSwapGates = [];

        for (let wireIndex = 0; wireIndex < wireCount; wireIndex++) {
            /**
             * Apply type for autocomplete.
             * @type {CellData}
             */
            let cellData = circuit[wireIndex][cellIndex];
            if (!cellData || !cellData.gate) continue;

            let translatedGate = GateAliases.ToSimulator[cellData.gate] ? GateAliases.ToSimulator[cellData.gate] : cellData.gate.toLowerCase();

            if (!SimpleGatesFilter.includes(cellData.gate)) {
                let translatedCell = {
                    type: translatedGate,
                    time: cellIndex,
                    targets: cellData.multigates.length > 0 ? cellData.multigates : [wireIndex],
                    controls: [...cellData.sources]
                };

                translatedCircuit.circuit.push(translatedCell);
            }

            if (cellData.gate === Gates.SWAP && !visitedSwapGates.includes(wireIndex)) {
                let translatedCell = {
                    type: translatedGate,
                    time: cellIndex,
                    targets: [...cellData.sources, wireIndex],
                    controls: []
                };
                visitedSwapGates = [...visitedSwapGates, ...cellData.sources, wireIndex];

                translatedCircuit.circuit.push(translatedCell);
            }
        }
    }
    return translatedCircuit;
}

export function translateToQuCircuit(circuit, cellAmount) {
    let inputs = circuit.input;
    let wireAmount = inputs.length;
    let quCircuit = new Array(wireAmount)
        .fill(null)
        .map(e => new Array(cellAmount));

    function fillTwinData(w, c, cellData) {
        fillData(w, c, cellData);
    }

    function fillData(w, c, cellData) {
        quCircuit[w][c] = new CellData(w, c, cellData.gate, [...cellData.ends], [...cellData.sources], [...cellData.multigates]);
    }

    for (let entry of circuit.circuit) {
        console.log(entry);
        let gate = GateAliases.FromSimulator[entry.type] ? GateAliases.FromSimulator[entry.type] : entry.type.toUpperCase();

        if (!Gates[gate]) {
            throw new Error(`Invalid gate '${gate}' found when importing`)
        }

        let ends = [];
        let sources = [];
        let wire = entry.targets[0];
        let cell = entry.time;
        let properties = GateProperties[gate];
        let multigates = properties.isMultigate ? entry.targets.map(e => parseInt(e)) : [];

        let cellData = { gate, ends, sources, multigates };

        if (gate === Gates.SWAP && entry.targets.length === 2) {
            sources.push(entry.targets[1]);
            ends.push(entry.targets[1]);
            fillTwinData(entry.targets[1], cell, cellData);
        }

        for (let control of entry.controls) {
            fillData(control, cell, {
                gate: Gates.CONTROL,
                sources: [],
                ends: [wire],
            });
            ends.push(control);
            sources.push(control);
        }

        fillData(wire, cell, cellData);
    }

    return [quCircuit, inputs.map(e => e.toString())];
}