import { getUserData } from "../util.js";

const host = 'https://parseapi.back4app.com/';
const appId = 'U1X2iBmuu0ukyo7uB4iE8Ux8LuBBh2Eituqu23wa';
const apiKey = 'ijyHf0q2ateWnwYfnFsJm8maqI3FzbtChxBM9V4J';

async function request(method, url, data) {
	const options = {
		method,
		headers: {
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key': apiKey,
		}
	}

	if (url.slice(0, 6) == '/users' || url.slice(0, 6) == '/login') {
		options.headers['X-Parse-Revocable-Session'] = 1;
	} else if (url.slice(0, 10) != '/functions' && url != '/requestPasswordReset') {
		url = '/classes' + url;
	}
	
	if (data != undefined) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(data);
	}

	const userData = getUserData();
	if (userData) {
		options.headers['X-Parse-Session-Token'] = userData.sessionToken;
	}

	try {
		const res = await fetch(host + url, options);

		if (!res.ok) {
			const error = await res.json();
			const err = new Error(error.error);
			err.code = error.code;
			throw err;
		}

		if (res.status == 204) {
			return res;
		} else {
			return res.json();
		}
	} catch (err) {
		console.error(err.message);
		throw err;
	}
}

export async function get(url) {
	return request('get', url);
}
export async function post(url, data) {
	return request('post', url, data);
}
export async function put(url, data) {
	return request('put', url, data);
}
export async function del(url) {
	return request('delete', url);
}