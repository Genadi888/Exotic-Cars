import { setUserData, deleteUserData } from '../util.js';
import * as api from './api.js';

export async function login(username, password, remember) {
	const result = await api.post('/login', { username, password });
	
	const userData = {
		username: result.username,
		id: result.objectId,
		sessionToken: result.sessionToken
	}

	console.log(userData)

	setUserData(userData, remember);

	return result;
}

export async function register(username, password, email, remember) {
	const result = await api.post('/users', { username, password, email });
	
	const userData = {
		username: username,
		id: result.objectId,
		sessionToken: result.sessionToken
	}

	setUserData(userData, remember);

	return result;
}

export function logout() {
	api.post('/logout');
	deleteUserData();
}

/* 
	{
		"username": "myuser123",
		"myCustomKeyName": "myCustomKeyValue",
		"createdAt": "2018-11-07T20:58:34.448Z",
		"updatedAt": "2018-11-07T20:58:34.448Z",
		"objectId": "g7y9tkhB7O",
		"sessionToken":"r:03a4c2d87a63a020a7d737c6fc64fd4c"
	}
*/