const numeric = require("numeric");

export function parseAmplitudes(nqubits, amplitudes) {
  const results = [];

  for (let i = 0; i < amplitudes.x.length; i++) {
    let amplitude = "";
    let state = "";

    for (let j = 0; j < nqubits; j++) {
      state = ((i & (1 << j)) >> j) + state;
    }

    amplitude += amplitudes.x[i].toFixed(8);
    amplitude += amplitudes.y[i] < 0 ? "-" : "+";
    amplitude += Math.abs(amplitudes.y[i]).toFixed(8) + "i";

    let prob = Math.pow(amplitudes.x[i], 2);
    prob += Math.pow(amplitudes.y[i], 2);
    const probability = (prob * 100).toFixed(4) + "%";

    if (prob < numeric.epsilon) {
      results.push({
        value: probability,
        impossible: true
      });
    } else {
      results.push({
        value: probability,
        impossible: false
      });
    }
  }
  return results;
}

export default {
  parseAmplitudes
};
