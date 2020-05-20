import { getUser, createUser, updateUser, deleteUser } from "./user";
import {
	solveCircuit,
	getAllCircuits,
	createCircuit,
	getSingleCircuit,
	updateCircuit,
	deleteCircuit,
} from "./circuit";

export const API_HOST = "localhost:4000";

export default {
	auth: {
		login: () => {},
	},
	user: {
		create: createUser,
		get: getUser,
		update: updateUser,
		delete: deleteUser,
		circuit: {
			create: createCircuit,
			getAll: getAllCircuits,
			getSingle: getSingleCircuit,
			update: updateCircuit,
			delete: deleteCircuit,
		},
	},
	circuit: {
		solve: solveCircuit,
	},
	task: {
		getAll: () => {},
		getSingle: () => {},
		submission: {
			get: () => {},
			update: () => {},
			delete: () => {},
		},
	},
	admin: {
		tasks: {
			create: () => {},
			getAll: () => {},
			getSingle: () => {},
			update: () => {},
			delete: () => {},
			submission: {
				getAll: () => {},
				update: () => {},
			},
		},
	},
};
