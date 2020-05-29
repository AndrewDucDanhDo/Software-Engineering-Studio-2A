import axios from 'axios';
import { auth } from "../firebase";
import { AuthContext } from "../../../context/auth";

const { authState } = useContext(AuthContext);

export const refreshAuth = failedRequest => auth.currentUser.getIdToken(true).then(tokenRefreshResponse => {
    authState.user.idToken = tokenRefreshResponse.data.token;
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
    return Promise.resolve();
});
