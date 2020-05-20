import React from "react";

export const AuthContext = React.createContext({
  authenticated: false,
  idToken: undefined,
  userProfile: undefined,
  setAuthState: () => {}
});
