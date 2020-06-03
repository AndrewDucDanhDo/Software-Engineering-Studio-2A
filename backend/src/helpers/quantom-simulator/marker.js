const quantumSimulator = require("./application");
const quantumParser = require("./parser");
const numeric = require("numeric");

async function solve(app, state) {
    return new Promise((resolve, reject) => {
        app.circuit.gates.sort((a, b) => a.time - b.time);
        const size = Math.pow(2, app.circuit.nqubits);
        const amplitudes = new numeric.T(
            numeric.rep([size], 0),
            numeric.rep([size], 0)
        );
        amplitudes.x[parseInt(state, 2)] = 1;

        app.applyCircuit(app.circuit, amplitudes, (amplitudes_y) => {
            const results = quantumParser.parseAmplitudes(
                app.circuit.nqubits,
                amplitudes_y
            );
            resolve(results);
        });
    });
}


export async function allSolutions(circuit) {
    return new Promise(async (resolve, reject) => {
        const nqubits = circuit.qubits;
        const app = new quantumSimulator(nqubits);
        app.loadWorkspace(circuit);

        var results = [];

        for (let i = 0; i < Math.pow(2, nqubits); i++) {
            let amplitude = "";
            let state = "";

            for (let j = 0; j < nqubits; j++) {
                state = ((i & (1 << j)) >> j) + state;
            }


            var result = {
                input: state,
                output: await solve(app, state)
            };
            results.push(result);
        }
        resolve(results);
    });
}

export async function markSubmission(solutions, nqubits, studentCircuit) {
    return new Promise(async (resolve, reject) => {
        const app = new quantumSimulator(nqubits);
        app.loadWorkspace(studentCircuit);

        if (nqubits != studentCircuit.qubits)
            resolve(0);

        var score = 0;
        var total = 0;

        for (const solution of solutions) {
            total++;
            const studentOutput = await solve(app, solution.input);
            if (JSON.stringify(studentOutput) === JSON.stringify(solution.output)) {
                score++;
            }
        };
        resolve(score / total);
    });
}