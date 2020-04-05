import admin from "../helpers/firebase";

export const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
    });
    return res.status(200).send(user);
  } catch (error) {
    // The cases for this code should be via tha firebase error codes
    // https://firebase.google.com/docs/auth/admin/errors
    switch (error.code) {
      case "auth/email-already-exists":
        return res.status(400).json({
          code: error.code,
          msg:
            "The email address provided has currently got an account associated with it"
        });
      default:
        console.error({ msg: "An unknown error was hit in createUser", error });

        return res.status(500).json({
          code: "unknown",
          msg: "An unknown error occurred while trying to create a new user.",
          error: error.toString()
        });
    }
  }
};
