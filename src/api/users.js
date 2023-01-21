import { setUserData, deleteUserData } from '../util.js';
import * as api from './api.js';

export async function login(username, password, remember) {
	const result = await api.post('/login', { username, password });
	
	const userData = {
		username: result.username,
		id: result.objectId,
		sessionToken: result.sessionToken
	}

	setUserData(userData, remember);

	return result;
}

export async function register(username, password, email) {
	const result = await api.post('/users', { username, password, email });
	return result;
}

export function logout(userPointer) {
	api.post('/functions/logout', { userPointer });
	deleteUserData();
}

export async function resetPassword(email) {
	return api.post('/requestPasswordReset', { email });
}