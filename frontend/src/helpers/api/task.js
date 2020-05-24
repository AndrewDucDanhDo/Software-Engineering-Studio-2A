import axios from "axios";
import { API_HOST } from ".";

export const getAllTasks = async (idToken) => {
	const res = await axios.get(`http://${API_HOST}/task`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const getSingleTask = async (idToken, taskId) => {
	const res = await axios.get(`http://${API_HOST}/task/${taskId}`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const createTask = async (idToken, taskData) => {
	const res = await axios.post(
		`http://${API_HOST}/admin/task/create`,
		taskData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const getAllTasksAdmin = async (idToken) => {
	const res = await axios.get(`http://${API_HOST}/admin/task`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const getSingleTasksAdmin = async (idToken, taskId) => {
	const res = await axios.get(`http://${API_HOST}/admin/task/${taskId}`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const updateTask = async (idToken, taskId, taskData) => {
	const res = await axios.post(
		`http://${API_HOST}/admin/task/${taskId}/update`,
		taskData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const deleteTask = async (idToken, taskId) => {
	const res = await axios.delete(
		`http://${API_HOST}/admin/task/${taskId}/update`,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};
