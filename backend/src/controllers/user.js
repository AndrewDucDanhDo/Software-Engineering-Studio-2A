import admin from "../helpers/firebase";
import { successResponse, errorResponse } from "../helpers/apiResponse";

export const createUser = async (req, res) => {
  try {
    // Parse details from request
    const { email, password, firstName, lastName } = req.body;

    // Create user in firebase
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
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
