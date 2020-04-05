var admin = require("firebase-admin");

// TODO: This could be done better
var serviceAccount = require("../../../service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // TODO: Get this from env variables
  databaseURL: "https://ses2a-quantum-solver.firebaseio.com"
});

export default admin
