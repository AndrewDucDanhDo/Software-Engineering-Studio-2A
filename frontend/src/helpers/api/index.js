import {
	getUser,
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
	deleteUserAdmin,
	getRoles,
	updateRoles,
} from "./user";
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
	markTask,
} from "./task";
import {
	getSubmission,
	getSingleSubmission,
	updateSubmission,
	deleteSubmission,
	getAllSubmissionsAdmin,
	updateSubmissionAdmin,
	createSubmission,
	runSubmission,
	markSubmission,
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
			create: createSubmission,
			get: getSubmission,
			update: updateSubmission,
			delete: deleteSubmission,
		},
	},
	admin: {
		users: {
			delete: deleteUserAdmin,
			getAll: getAllUsers,
			roles: {
				get: getRoles,
				update: updateRoles,
			},
		},
		tasks: {
			create: createTask,
			getAll: getAllTasksAdmin,
			getSingle: getSingleTasksAdmin,
			update: updateTask,
			delete: deleteTask,
			mark: markTask,
			submission: {
				getAll: getAllSubmissionsAdmin,
				getSingle: getSingleSubmission,
				update: updateSubmissionAdmin,
				run: runSubmission,
				mark: markSubmission,
			},
		},
	},
};
