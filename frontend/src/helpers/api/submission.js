import axios from "axios";
import { API_HOST } from ".";

export const getSubmission = async (idToken, taskId) => {
	const res = await axios.get(`http://${API_HOST}/task/${taskId}/submission`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const getSingleSubmission = async (idToken, taskId, userId) => {
	const res = await axios.get(`http://${API_HOST}/admin/task/${taskId}/submission/${userId}`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const updateSubmission = async (idToken, taskId, circuitData) => {
	const res = await axios.post(
		`http://${API_HOST}/task/${taskId}/submission/update`,
		circuitData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const createSubmission = async (idToken, taskId, circuitData) => {
	const res = await axios.post(
		`http://${API_HOST}/task/${taskId}/submit`,
		circuitData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const deleteSubmission = async (idToken, taskId) => {
	const res = await axios.delete(
		`http://${API_HOST}/task/${taskId}/submission/update`,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const getAllSubmissionsAdmin = async (idToken, taskId) => {
	const res = await axios.get(
		`http://${API_HOST}/admin/task/${taskId}/submission`,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const updateSubmissionAdmin = async (idToken, taskId, userId, resultsData) => {
	const res = await axios.post(
		`http://${API_HOST}/admin/task/${taskId}/submission/${userId}/update`,
		resultsData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const runSubmission = async (idToken, taskId, userId) => {
	const res = await axios.get(
		`http://${API_HOST}/admin/task/${taskId}/submission/${userId}/mark`,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const markSubmission = async (idToken, taskId, userId) => {
	const res = await axios.post(
		`http://${API_HOST}/admin/task/${taskId}/submission/${userId}/mark`,
		null,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};
