import { Gates } from "../../components/quCircuit/gates";

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
            let cellData = circuit[wireIndex][cellIndex];
            if (!cellData || !cellData.gate) continue;

            let translatedGate = GateAliases.ToSimulator[cellData.gate] ? GateAliases.ToSimulator[cellData.gate] : cellData.gate.toLowerCase();

            if (!SimpleGatesFilter.includes(cellData.gate)) {
                let translatedCell = {
                    type: translatedGate,
                    time: cellIndex,
                    targets: [wireIndex],
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
        fillData(w, c, {
          gate: cellData.gate,
          ends: cellData.sources,
          sources: cellData.ends,
        });
    }

    function fillData(w, c, cellData) {
        quCircuit[w][c] = cellData;
    }

    for (let entry of circuit.circuit) {
        let gate = GateAliases.FromSimulator[entry.type] ? GateAliases.FromSimulator[entry.type] : entry.type.toUpperCase();
        let ends = [];
        let sources = [];
        let wire = entry.targets[0];
        let cell = entry.time;

        let cellData = { gate, ends, sources };

        if (gate === Gates.SWAP && entry.targets.length === 2) {
            ends.push(entry.targets[1]);
            fillTwinData(entry.targets[1], cell, cellData);
        }

        for (let control of entry.controls) {
            fillData(control, cell, {
                gate: Gates.CONTROL,
                sources: [wire],
                ends: [wire],
            });
            ends.push(control);
            sources.push(control);
        }

        fillData(wire, cell, cellData);
    }

    return [quCircuit, inputs.map(e => e.toString())];
}