import {
  successResponse,
  errorResponse,
  handleApiError
} from "../helpers/apiResponse";
import { db } from "../helpers/firebase-admin";
import { checkParams } from "../helpers/validators/params";
import { checkCircuitData } from "../helpers/validators/circuitData";
import { FirestoreError } from "../errors/firestore";

const quantumSimulator = require("../helpers/quantom-simulator/application");
const quantumParser = require("../helpers/quantom-simulator/parser");
const numeric = require("numeric");

export function solve(req, res) {
  try {
    const circuit = req.body;

    checkCircuitData(circuit);

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
    const userCircuitDoc = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId)
      .get();

    // Check if the doc has been save yet and handle accordingly
    if (userCircuitDoc.exists === false) {
      // The circuit to be created doesn't exist yet so write to firestore
      await userCircuitDoc.ref.set(circuitData);

      // Send a success response back
      return res
        .status(200)
        .json(
          successResponse({ msg: "Circuit was successfully created for user" })
        );
    } else {
      throw new FirestoreError("exists", userCircuitDoc.ref, "circuit");
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

    const userCircuitDoc = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId)
      .get();

    if (userCircuitDoc.exists === true) {
      // The document for the circuit exists so fetch and return it to the user
      const circuitData = userCircuitDoc.data();
      return res.status(200).json(successResponse(circuitData));
    } else {
      throw new FirestoreError("missing", userCircuitDoc.ref, "circuit");
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

    const userCircuitsCollection = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .get();

    if (userCircuitsCollection.empty === false) {
      const userCircuits = userCircuitsCollection.docs.map((doc) => {
        return {
          circuitId: doc.id,
          circuitData: doc.data()
        };
      });

      return res.status(200).json(successResponse({ circuits: userCircuits }));
    } else {
      return res.status(200).json(successResponse({ circuits: [] }));
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

    const userCircuitDoc = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId)
      .get();

    if (userCircuitDoc.exists === true) {
      await userCircuitDoc.ref.set(circuitData);
      return res
        .status(200)
        .json(successResponse({ msg: "Circuit was updated successfully" }));
    } else {
      throw new FirestoreError("missing", userCircuitDoc.ref, "circuit");
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

    const userCircuitDoc = await db
      .collection("users")
      .doc(userId)
      .collection("circuits")
      .doc(circuitId)
      .get();

    if (userCircuitDoc.exists === true) {
      // Delete the document if it exists
      await userCircuitDoc.ref.delete();
      return res
        .status(200)
        .json(
          successResponse({ msg: "User circuit was deleted successfully" })
        );
    } else {
      throw new FirestoreError("missing", userCircuitDoc.ref, "circuit");
    }
  } catch (error) {
    return handleApiError(res, error);
  }
};
