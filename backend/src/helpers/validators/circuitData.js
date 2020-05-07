export class CircuitDataSyntaxError extends Error {
  constructor(missingKey) {
    super(`The key ${missingKey} was not found on the circuitData object`);
    this.name = "CircuitDataSyntaxError";
    this.missingKey = missingKey;
  }
}

// Call this function to check if a quantum circuit object is valid
// Required keys param is optional if the required keys need to be
// replaced with a different set of required keys
export const checkCircuitData = (
  data,
  requiredKeys = ["gates", "circuit", "qubits", "input"]
) => {
  requiredKeys.forEach((key) => {
    if (data[key] === undefined) {
      throw new CircuitDataSyntaxError(key);
    }
  });
};
