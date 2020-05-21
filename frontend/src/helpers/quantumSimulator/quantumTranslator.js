import { Gates } from "../../components/quCircuit/gates";

export function translateToSimulator(circuit, circuitInputs) {
    const SimpleGatesFilter = [Gates.CONTROL, Gates.SWAP];

    const GateAliases = {
        [Gates.CNOT]: "x",
    };

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

            let translatedGate = GateAliases[cellData.gate] ? GateAliases[cellData.gate] : cellData.gate.toLowerCase();

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

export function translateToQuCircuit(circuit) {
    // TODO
}