const numeric = require("numeric");

const reduceAmplitude = (result) => {
  const [firstPart, secondPart] = result
    .replace("i", "")
    .match(/(\-|\+)?\d*(\.)\d{8}/g)
    .map((num) => parseFloat(num).toFixed(4));
  // Parse float will strip the + sign so add it in if a positive
  const separator = secondPart >= 0 ? "+" : "";
  return `${firstPart}${separator}${secondPart}i`;
};

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
      // results.push({
      //   value: probability,
      //   impossible: true,
      //   amplitude: amplitude,
      //   state: state
      // });
    } else {
      results.push({
        value: probability,
        impossible: false,
        amplitude: reduceAmplitude(amplitude),
        state: state
      });
    }
  }
  return results;
}

export default {
  parseAmplitudes
};
