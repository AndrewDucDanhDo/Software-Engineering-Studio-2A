import admin from "../helpers/firebase";
import { successResponse, errorResponse } from "../helpers/apiResponse";

export const createUser = async (req, res) => {
  try {
    // Parse details from request
    const { email, password, displayName } = req.body;

    // Create user in firebase
    const user = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Return success with created user details
    return res.status(200).json(successResponse(user));
  } catch (error) {
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

export const getUser = async (req, res) => {
  try {
    // Get details from the request
    const userId = req.params.userId;

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
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to fetch user details.",
              undefined,
              error
            )
          );
    }
  }
};

export const updateUser = async (req, res) => {
  try {
    // Parse details from the request
    const userId = req.params.userId;
    const updateUserBody = req.body;

    // Update current user details from firebase
    const updatedUserDetails = await admin
      .auth()
      .updateUser(userId, updateUserBody);

    // Prepare a response
    return res.status(200).json(successResponse(updatedUserDetails));
  } catch (error) {
    switch (error.code) {
      default:
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to update user details.",
              undefined,
              error
            )
          );
    }
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Parse request details
    const userId = req.params.userId;

    // Delete current user details from firebase
    await admin.auth().deleteUser(userId);

    // Prepare a response
    return res
      .status(200)
      .json(successResponse({ msg: "User was successfully deleted." }));
  } catch (error) {
    switch (error.code) {
      default:
        return res
          .status(500)
          .json(
            errorResponse(
              "An unknown error occurred while trying to delete user.",
              undefined,
              error
            )
          );
    }
  }
};
