import * as firebase from "firebase/app";
import "firebase/auth";

const config = {
	apiKey: "AIzaSyCE_TaEaKZRlCJ4-2LVWIXDzaSG7Oncy30",
	authDomain: "ses2a-quantum-solver.firebaseapp.com",
	databaseURL: "https://ses2a-quantum-solver.firebaseio.com",
	projectId: "ses2a-quantum-solver",
	storageBucket: "ses2a-quantum-solver.appspot.com",
	messagingSenderId: "1039613240614",
	appId: "1:1039613240614:web:1c8293ec56902bf5080de7",
};

firebase.initializeApp(config);

export const auth = firebase.auth;

export default firebase;
