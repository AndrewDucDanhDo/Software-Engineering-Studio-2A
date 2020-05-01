import axios from "axios";
import { auth } from "../firebase";

export const createUser = (data) => {
	// TODO: Pull the api url from env
	return axios.post("http://localhost:4000/user/create", data);
};

export const loginUser = async (email, password) => {
	const user = (await auth().signInWithEmailAndPassword(email, password)).user;
	const idToken = await user.getIdToken()
	return {
		user, // The full firebase user object
		idToken // idToken for the user, should be saved in session
	};
};
