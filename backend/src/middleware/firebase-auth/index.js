import admin from "../../helpers/firebase-admin";

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
    } catch (e) {
      return res
        .status(401)
        // TODO fix this so its compliant with the other api responses
        .send({ error: "You are not authorized to make this request" });
    }
  });
};
