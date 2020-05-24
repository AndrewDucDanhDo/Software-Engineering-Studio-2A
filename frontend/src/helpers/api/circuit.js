import axios from "axios";
import { API_HOST } from ".";

export const solveCircuit = async (circuitData) => {
	const res = await axios.post(`http://${API_HOST}/circuit/solve`, circuitData);
	return res;
};

export const getAllCircuits = async (idToken, userId) => {
	const res = await axios.get(`http://${API_HOST}/user/${userId}/circuit`, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const getSingleCircuit = async (idToken, userId, circuitId) => {
	const res = await axios.get(
		`http://${API_HOST}/user/${userId}/circuit/${circuitId}`,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const createCircuit = async (idToken, circuitData) => {
	const res = await axios.post(`http://${API_HOST}/user/circuit/create`, circuitData, {
		headers: { Authorization: `Bearer ${idToken}` },
	});
	return res;
};

export const updateCircuit = async (
	idToken,
	userId,
	circuitId,
	circuitData
) => {
	const res = await axios.post(
		`http://${API_HOST}/user/${userId}/circuit/${circuitId}/update`,
		circuitData,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};

export const deleteCircuit = async (idToken, userId, circuitId) => {
	const res = await axios.delete(
		`http://${API_HOST}/user/${userId}/circuit/${circuitId}/update`,
		{
			headers: { Authorization: `Bearer ${idToken}` },
		}
	);
	return res;
};
