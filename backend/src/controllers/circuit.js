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
    // Parse details from the request
    const circuitToSave = req.body;

    // Throw an error if no request body and the request body is not object
    if (circuitToSave === undefined || typeof circuitToSave !== "object") {
      throw new Error("Body must be of type object.");
    }

    // Check if the circuit contains the required keys for a valid circuit
    const requiredKeys = ["gates", "circuit", "qubits", "input"];
    requiredKeys.forEach((value) => {
      if (circuitToSave[value] === undefined) {
        throw new Error(`Key ${value} is required in the request body.`);
      }
    });

    // Save to firebase

    // // Send a success response back
    // return res
    // .status(200)
    // .json(successResponse({ msg: "Circuit was successfully created for user" }));

    // TODO: Remove when done
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
    // Parse details from the request
    const userId = req.params.userId;
    const circuitId = req.params.circuitId;

    // Fetch the requested circuit fro firebase
    let results;
    if (circuitId !== undefined) {
    } else {
      // If no circuit id provided fallback too getting all circuits for user
    }

    // // Send a success response back
    // switch (typeof results) {
    //   case "object":
    //     return res.status(200).json(successResponse(results));
    //   case "array":
    //     return res.status(200).json(successResponse({ circuits: results }));
    //   default:
    //     throw new Error("Unknown results type for response.")
    // }

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
    // Parse details from the request
    const userId = req.params.userId;
    const circuitId = req.params.circuitId;
    const circuitToSave = req.body;

    // Throw an error if no request body and the request body is not object
    if (circuitToSave === undefined || typeof circuitToSave !== "object") {
      throw new Error("Body must be of type object.");
    }

    // Check if the circuit contains the required keys for a valid circuit
    const requiredKeys = ["gates", "circuit", "qubits", "input"];
    requiredKeys.forEach((value) => {
      if (circuitToSave[value] === undefined) {
        throw new Error(`Key ${value} is required in the request body.`);
      }
    });

    // Save to firebase

    // // Send a success response back
    // return res
    // .status(200)
    // .json(successResponse({ msg: "Circuit was successfully created for user" }));

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
              // TODO: Get all these values from a single config option
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
    // Parse details from the request
    const userId = req.params.userId;
    const circuitId = req.params.circuitId;

    // Delete circuit from firebase

    // // Send a success response back
    // return res
    // .status(200)
    // .json(successResponse({ msg: "Circuit was successfully deleted" }));

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
              "An unknown error occurred while trying to delete circuit.",
              undefined,
              error
            )
          );
    }
  }
};
