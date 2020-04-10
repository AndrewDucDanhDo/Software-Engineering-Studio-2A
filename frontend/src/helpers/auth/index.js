import axios from "axios";
import { auth } from "../firebase";

export const createUser = (data) => {
	// TODO: Pull the api url from env
	return axios.post("http://localhost:4000/user/create", data);
};

export const loginUser = (email, password) => {
	return auth().signInWithEmailAndPassword(email, password);
};
