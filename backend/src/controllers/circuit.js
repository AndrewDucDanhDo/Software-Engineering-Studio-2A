import {
  successResponse,
  errorResponse,
  handleApiError
} from "../helpers/apiResponse";
import admin from "../helpers/firebase-admin";
import { checkParams } from "../helpers/validators/params";
import { checkCircuitData } from "../helpers/validators/circuitData";

const quantumSimulator = require("../helpers/quantom-simulator/application");
const quantumParser = require("../helpers/quantom-solver/parser");
const numeric = require("numeric");
const db = admin.firestore();

export function solve(req, res) {
  try {
    const circuit = req.body;

    checkCircuitData(circuit)

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
      res.status(200).json({
        results
      });
    });
  } catch (error) {
    return handleApiError(res, error);
  }
}

export const saveUserCircuit = async (req, res) => {
  try {
    // Parse details from the request
    const userId = req.authId;
    const { circuitData, circuitId } = req.body;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      },
      circuitId: {
        data: circuitId,
        expectedType: "string"
      },
      circuitData: {
        data: circuitData,
        expectedType: "object"
      }
    });

    checkCircuitData(circuitData);

    // Create a fire store ref for easier access to the same path
    const userCircuitRef = db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId);

    // Check if the doc has been save yet and handle accordingly
    if ((await userCircuitRef.get()).exists === false) {
      // The circuit to be created doesn't exist yet so write to firestore
      await userCircuitRef.set(circuitData);

      // Send a success response back
      return res
        .status(200)
        .json(
          successResponse({ msg: "Circuit was successfully created for user" })
        );
    } else {
      // The circuit id already exists for the user so throw a unique error
      // as we do not want to over write a saved circuit
      return res
        .status(400)
        .json(
          errorResponse(
            "The requested circuit name already exists for this user",
            "circuit-exists",
            undefined
          )
        );
    }
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const getUserCircuit = async (req, res) => {
  try {
    // Parse details from the request
    const userId = req.params.userId;
    const circuitId = req.params.circuitId;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      },
      circuitId: {
        data: circuitId,
        expectedType: "string"
      }
    });

    const userCircuitData = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId)
      .get();

    if (userCircuitData.exists === true) {
      // The document for the circuit exists so fetch and return it to the user
      const circuitData = userCircuitData.data();
      return res.status(200).json(successResponse(circuitData));
    } else {
      // No document for the circuit id exists so return an error
      return res
        .status(400)
        .json(
          errorResponse(
            "The requested circuit name does not exist for the user",
            "circuit-missing",
            undefined
          )
        );
    }
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const getAllUserCircuits = async (req, res) => {
  try {
    // Parse details from the request
    const userId = req.params.userId;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    const userCircuitsCollectionData = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .get();

    if (userCircuitsCollectionData.empty === false) {
      const userCircuits = userCircuitsCollectionData.docs.map((doc) => {
        return {
          circuitId: doc.id,
          circuitData: doc.data()
        };
      });

      return res.status(200).json(successResponse({ circuits: userCircuits }));
    } else {
      // No circuits have been saved for the user
      return res
        .status(400)
        .json(
          errorResponse(
            "The user has no saved circuits.",
            "circuits-empty",
            undefined
          )
        );
    }
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const updateUserCircuit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const circuitId = req.params.circuitId;
    const circuitData = req.body;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      },
      circuitId: {
        data: circuitId,
        expectedType: "string"
      },
      circuitData: {
        data: circuitData,
        expectedType: "object"
      }
    });

    checkCircuitData(circuitData);

    const userCircuitRef = db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId);

    if ((await userCircuitRef.get()).exists === true) {
      await userCircuitRef.set(circuitData);
      return res
        .status(200)
        .json(successResponse({ msg: "Circuit was updated successfully" }));
    } else {
      return res
        .status(400)
        .json(
          errorResponse(
            "The requested circuit name does not exists for this user and cannot be updated",
            "circuit-missing",
            undefined
          )
        );
    }
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const deleteUserCircuit = async (req, res) => {
  try {
    // Parse details from the request
    const userId = req.params.userId;
    const circuitId = req.params.circuitId;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      },
      circuitId: {
        data: circuitId,
        expectedType: "string"
      }
    });

    const userCircuitData = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId)
      .get();

    if (userCircuitData.exists === true) {
      // Delete the document if it exists
      await userCircuitData.ref.delete();
      return res
        .status(200)
        .json(
          successResponse({ msg: "User circuit was deleted successfully" })
        );
    } else {
      // Document doesn't exists so throw an error
      return res
        .status(400)
        .json(
          errorResponse(
            "The requested circuit name does not exist for the user",
            "circuit-missing",
            undefined
          )
        );
    }
  } catch (error) {
    return handleApiError(res, error);
  }
};
