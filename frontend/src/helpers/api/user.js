import axios from "axios";
import { API_HOST } from ".";

export const getUser = async (idToken, userId) => {
	const res = await axios.get(`http://${API_HOST}/user/${userId}`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const createUser = async (userData) => {
	const res = await axios.post(`http://${API_HOST}/user/create`, userData);
	return res;
};

export const updateUser = async (idToken, userId, userData) => {
	const res = await axios.post(
		`http://${API_HOST}/user/${userId}/update`,
		userData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const deleteUser = async (idToken, userId) => {
	const res = await axios.delete(`http://${API_HOST}/user/${userId}/update`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};
