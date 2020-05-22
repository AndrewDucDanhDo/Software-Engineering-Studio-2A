import { getUser, createUser, updateUser, deleteUser } from "./user";
import {
	solveCircuit,
	getAllCircuits,
	createCircuit,
	getSingleCircuit,
	updateCircuit,
	deleteCircuit,
} from "./circuit";
import {
	getAllTasks,
	getSingleTask,
	createTask,
	getAllTasksAdmin,
	getSingleTasksAdmin,
	updateTask,
	deleteTask,
} from "./task";
import {
	getSubmission,
	updateSubmission,
	deleteSubmission,
	getAllSubmissionsAdmin,
	updateSubmissionAdmin,
} from "./submission";

export const API_HOST = "localhost:4000";

export default {
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
		getAll: getAllTasks,
		getSingle: getSingleTask,
		submission: {
			get: getSubmission,
			update: updateSubmission,
			delete: deleteSubmission,
		},
	},
	admin: {
		tasks: {
			create: createTask,
			getAll: getAllTasksAdmin,
			getSingle: getSingleTasksAdmin,
			update: updateTask,
			delete: deleteTask,
			submission: {
				getAll: getAllSubmissionsAdmin,
				update: updateSubmissionAdmin,
			},
		},
	},
};
