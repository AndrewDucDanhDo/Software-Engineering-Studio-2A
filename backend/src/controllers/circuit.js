import { successResponse } from "../helpers/apiResponse";

const quantumSimulator = require("../helpers/quantom-simulator/application");
const quantumParser = require("../helpers/quantom-solver/parser");
const numeric = require("numeric");

export function solve(req, response) {
  // TODO: We should write a validator to check the circuit json format is correct before attempting to solve
  try {
    // TODO: Look into how the circuit object is transformed im concerned its currently not doing anything
    const circuit = req.body;
    const nqubits = circuit.qubits;
    const state = circuit.input.join("");
    const app = new quantumSimulator(nqubits);
    app.loadWorkspace(circuit);

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
      response.status(200).json({
        results
      });
    });
  } catch (error) {
    response.status(500).json({
      msg: "An unknown error occurred while trying to solve the circuit.",
      error: error.toString()
    });
  }
}

export const saveUserCircuit = async (req, res) => {
  try {
    return res
      .status(501)
      .json(successResponse({ msg: "Endpoint not yet implemented" }));
  } catch (error) {
    switch (error.code) {
      default:
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to create a new user.",
              undefined,
              error
            )
          );
    }
  }
};

// TODO: Make this handle fetching a single circuit and all based on if circuit Id is present
export const getUserCircuit = async (req, res) => {
  try {
    return res
      .status(501)
      .json(successResponse({ msg: "Endpoint not yet implemented" }));
  } catch (error) {
    switch (error.code) {
      default:
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to create a new user.",
              undefined,
              error
            )
          );
    }
  }
};

export const updateUserCircuit = async (req, res) => {
  try {
    return res
      .status(501)
      .json(successResponse({ msg: "Endpoint not yet implemented" }));
  } catch (error) {
    switch (error.code) {
      default:
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to create a new user.",
              undefined,
              error
            )
          );
    }
  }
};

export const deleteUserCircuit = async (req, res) => {
  try {
    return res
      .status(501)
      .json(successResponse({ msg: "Endpoint not yet implemented" }));
  } catch (error) {
    switch (error.code) {
      default:
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to create a new user.",
              undefined,
              error
            )
          );
    }
  }
};
