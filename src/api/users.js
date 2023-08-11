import { setUserData, deleteUserData, getUserData } from '../util.js';
import * as api from './api.js';
import { createPointer } from './data.js';

export async function login(username, password, remember) {
	const result = await api.post('/login', { username, password });
	
	const userData = {
		username: result.username,
		id: result.objectId,
		sessionToken: result.sessionToken
	}

	setUserData(result, remember);

	return result;
}

export async function register(username, password, email) {
	const result = await api.post('/users', { username, password, email });
	return result;
}

export async function editUser(username) {
	const userData = getUserData();
	const results = [];

	results[0] = await api.put(`/users/${userData.objectId}`, { username });

	return results;
}

export async function logout() {
	const userPointer = createPointer('_User', getUserData().objectId);
	deleteUserData(); //TODO: Need to fix the logout bug!
	await api.post('/functions/logout', { userPointer });
}

export async function resetPassword(email) {
	return api.post('/requestPasswordReset', { email });
}