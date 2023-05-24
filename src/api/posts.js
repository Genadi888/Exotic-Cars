import * as api from './api.js';
import { addEntryWithUserPointer } from './data.js';

export async function getAllPosts(ctx) {
	return (await api.post('/functions/getPosts')).result;
}

export async function getAllUnapprovedPosts() {
	const allPosts = (await api.post('/functions/getUnapprovedPosts')).result;
	return allPosts;
}

export async function getCountOfUnapprovedPostsOfUser() {
	const count = (await api.post('/functions/getCountOfUnapprovedPostsOfUser')).result;
	return count;
}

export async function approvePost(objectId) {
	return api.post('/functions/approvePost', { objectId });
}

export async function getPostById(id) {
	return (await api.post(`/functions/getPostById`, { objectId: id })).result;
}

export async function createPost(post) {
	addEntryWithUserPointer(post, 'owner');
	return api.post('/functions/createPost', post);
}

export async function deletePost(postId) {
	return api.del(`/Posts/${postId}`);
}

export async function editPost(newPost) {
	addEntryWithUserPointer(newPost, 'owner');
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