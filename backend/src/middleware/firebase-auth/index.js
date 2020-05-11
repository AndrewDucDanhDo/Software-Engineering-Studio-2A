import admin from "../../helpers/firebase-admin";
import { handleApiError } from "../../helpers/apiResponse";

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

export class AuthenticationError extends Error {
  constructor() {
    super();
    this.name = "AuthenticationError";
  }
}

// Check the id token is valid using the auth token fetched from the
// authoritative header and check it is valid using the firebase admin SDK
export const checkToken = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      req.userClaims = { teacher: userInfo.teacher };
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

// Check the token is teacher role 
export const checkTeacher = (req, res, next) => {
  const { teacher } = req.userClaims;
  
  if (teacher === true) {
    return next();
  }
  return handleApiError(res, new AuthenticationError());
};
