import admin from "../../helpers/firebase-admin";
import { handleApiError } from "../../helpers/apiResponse";
import { AuthenticationError } from "../../errors/auth";

// Get the bearer token form the authorization header
// and make it available under req.auth token
const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

// Check the id token is valid using the auth token fetched from the
// authoritative header and check it is valid using the firebase admin SDK
export const checkToken = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (error) {
      return handleApiError(res, new AuthenticationError());
    }
  });
};

// Make sure that the authId matches the userId that is
// being fetched via the userId path param
export const checkUser = (req, res, next) => {
  // This is made available via the firebase checkToken middleware
  const { authId } = req;
  const userId = req.params.userId;

  if (authId == userId) {
    return next();
  } else {
    return handleApiError(res, new AuthenticationError());
  }
};

// Check if the user is of type teacher
export const checkTeacherRole = (req, res, next) => {
  // TODO: Implement this when we have a solution for user roles
  return next();
};
