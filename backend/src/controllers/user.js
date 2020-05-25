import admin from "../helpers/firebase-admin";
import {
  successResponse,
  errorResponse,
  handleApiError
} from "../helpers/apiResponse";
import { checkParams } from "../helpers/validators/params";

export const createUser = async (req, res) => {
  try {
    // Parse details from request
    const { email, password, displayName } = req.body;

    checkParams({
      email: {
        data: email,
        expectedType: "string"
      },
      password: {
        data: password,
        expectedType: "string"
      },
      displayName: {
        data: displayName,
        expectedType: "string"
      }
    });

    // Create user in firebase
    const user = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Return success with created user details
    return res.status(200).json(successResponse(user));
  } catch (error) {
    // TODO: Try and have this handled by the handleApiError func
    // The cases for this code should be via tha firebase error codes
    // https://firebase.google.com/docs/auth/admin/errors
    switch (error.code) {
      case "auth/email-already-exists":
        return res
          .status(400)
          .json(
            errorResponse(
              "The email address provided has currently got an account associated with it",
              error.code,
              error
            )
          );
      case "auth/invalid-password":

        return res
          .status(400)
          .json(
            errorResponse(
              "The password does not meet requirements (6 letters in length)",
              error.code,
              error
            )
          );
      default:
        return handleApiError(res, error);
    }
  }
};

export const getUser = async (req, res) => {
  try {
    // Get details from the request
    const userId = req.params.userId;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    // Get details from firebase
    const userDetails = await admin.auth().getUser(userId);

    // Prepare a response
    return res.status(200).json(successResponse(userDetails));
  } catch (error) {
    // The cases for this code should be via tha firebase error codes
    // https://firebase.google.com/docs/auth/admin/errors
    switch (error.code) {
      case "auth/user-not-found":
        return res
          .status(500)
          .json(
            errorResponse(
              "No user found for the provided userId.",
              error.code,
              undefined
            )
          );
      default:
        return handleApiError(res, error);
    }
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Get details from firebase
    const userDetails = await admin.auth().listUsers();

    // Prepare a response
    return res.status(200).json(successResponse(userDetails));
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    // Parse details from the request
    const userId = req.params.userId;
    const updateUserBody = req.body;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      },
      updateUserBody: {
        data: updateUserBody,
        expectedType: "object"
      }
    });

    // Update current user details from firebase
    const updatedUserDetails = await admin
      .auth()
      .updateUser(userId, updateUserBody);

    // Prepare a response
    return res.status(200).json(successResponse(updatedUserDetails));
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Parse request details
    const userId = req.params.userId;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    // Delete current user details from firebase
    await admin.auth().deleteUser(userId);

    // Prepare a response
    return res
      .status(200)
      .json(successResponse({ msg: "User was successfully deleted." }));
  } catch (error) {
    return handleApiError(res, error);
  }
};

export const getUserRoles = async (req, res) => {
  try {
    // Get details from the request
    const userId = req.params.userId;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      }
    });

    // Get user roles from firebase
    var { customClaims } = await admin.auth().getUser(userId);

    // If no roles are set prepare empty customClaims so it can be filtered
    if (typeof customClaims === "undefined") customClaims = {};

    const filteredRoles = {
      teacher: customClaims.teacher || false,
      superuser: customClaims.superuser || false
    };

    // Prepare a response
    return res.status(200).json(successResponse(filteredRoles));
  } catch (error) {
    // The cases for this code should be via tha firebase error codes
    // https://firebase.google.com/docs/auth/admin/errors
    switch (error.code) {
      case "auth/user-not-found":
        return res
          .status(500)
          .json(
            errorResponse(
              "No user found for the provided userId.",
              error.code,
              undefined
            )
          );
      default:
        return handleApiError(res, error);
    }
  }
};

export const updateUserRoles = async (req, res) => {
  try {
    const userRoles = req.body;
    const { userId } = req.params;

    checkParams({
      userId: {
        data: userId,
        expectedType: "string"
      },
      userRoles: {
        data: userRoles,
        expectedType: "object"
      }
    });

    const filteredRoles = {
      teacher: userRoles.teacher || false,
      superuser: userRoles.superuser || false
    };

    await admin.auth().setCustomUserClaims(userId, filteredRoles);
    return res
      .status(200)
      .json(successResponse({ msg: "The action was completed successfully." }));
  } catch (error) {
    return handleApiError(res, error);
  }
};
