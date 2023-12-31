import * as api from './api.js';
import { addEntryWithUserPointer } from './data.js';

export async function* get2PostObjects() {
	const postsCount = await getApprovedPostsCount();

	for (let i = 0; i < postsCount; i += 2) {
		const result = (await api.post('/functions/get2Posts', { skip: i })).result;

		if (result.length == 0) {
			//? If we didn't get any posts from server, return an empty array and signal the end of this generator.
			return [];
		} else {
			yield result; //? Otherwise, yield the result and wait for the next call.
		}
	}
}

export async function* get2UnapprovedPostObjects() {
	const postsCount = await getUnapprovedPostsCount();

	for (let i = 0; i < postsCount; i += 2) {
		const result = (await api.post('/functions/get2UnapprovedPosts', { skip: i })).result;

		if (result.length == 0) {
			//? If we didn't get any posts from server, return an empty array and signal the end of this generator.
			return [];
		} else {
			yield result; //? Otherwise, yield the result and wait for the next call.
		}
	}
}

export async function* get2SearchedPostObjects(searchedPostsIds) {
	for (let i = 0; i < searchedPostsIds.length; i += 2) {
		const result = (await api.post('/functions/get2PostsByIds', { searchedPostsIds: JSON.stringify(searchedPostsIds.slice(i, i + 2)) })).result;

		if (result.length == 0) {
			//? If we didn't get any posts from server, return an empty array and signal the end of this generator.
			return [];
		} else if (result.length == 1) {
			//? if we got the last post, signal the end of this generator.
			return result;
		} else {
			yield result; //? Otherwise, yield the result and wait for the next call.
		}
	}
}

export async function* get2UnapprovedSearchedPostObjects(searchedPostsIds) {
	for (let i = 0; i < searchedPostsIds.length; i += 2) {
		const result = (await api.post('/functions/get2UnapprovedPostsByIds', { searchedPostsIds: JSON.stringify(searchedPostsIds.slice(i, i + 2)) })).result;

		if (result.length == 0) {
			//? If we didn't get any posts from server, return an empty array and signal the end of this generator.
			return [];
		} else if (result.length == 1) {
			//? if we got the last post, signal the end of this generator.
			return result;
		} else {
			yield result; //? Otherwise, yield the result and wait for the next call.
		}
	}
}

async function getUnapprovedPostsCount() {
	return (await api.post('/functions/getUnapprovedPostsCount')).result
}

async function getApprovedPostsCount() {
	return (await api.post('/functions/getApprovedPostsCount')).result
}

export async function getAllUnapprovedPosts() {
	return (await api.post('/functions/getUnapprovedPosts')).result;
}

export async function getCountOfUnapprovedPostsOfUser() {
	return (await api.post('/functions/getCountOfUnapprovedPostsOfUser')).result;
}

export async function approvePost(objectId) {
	return api.post('/functions/approvePost', { objectId });
}

export async function getPostById(id) {
	return (await api.post(`/functions/getPostById`, { objectId: id })).result;
}

export async function createPost(post) {
	return api.post('/functions/createPost', post);
}

export async function deletePost(postId) {
	return api.del(`/Posts/${postId}`);
}

export async function editPost(newPost) {
	return api.post(`/functions/editPost`, newPost);
}

export async function likePost(postId) {
	const like = { postId };
	addEntryWithUserPointer(like, 'userWhoLiked');
	return api.post(`/functions/likePost`, like);
}

export async function unlikePost(postId, userId) {
	const { objectId: likeObjId } =
		(await api.get(`/PostsLikes?where={"postId": "${postId}", 
	"userWhoLiked": {"__type":"Pointer","className":"_User","objectId":"${userId}"}}`)).results[0];
	return api.del(`/PostsLikes/${likeObjId}`);
}

export async function reportObject(report) {
	addEntryWithUserPointer(report, 'reporter');
	await api.post('/functions/reportObject', report);
}

export async function searchForPosts(srchText) {
	try {
		const response = await fetch("https://ex0tic-cars.netlify.app/.netlify/functions/search",
		{ body: srchText, method: 'POST' });

		if (!response.ok) {
			const error = await response.json();
			const err = new Error(error.error);
			err.code = error.code;
			throw err;
		}

		if (response.status == 204) {
			return [];
		} else {
			const srchResultsArr = await response.json();
			return srchResultsArr;
		}
	} catch (error) {
		alert(error.message);
		throw error;
	}
}