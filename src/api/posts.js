import * as api from './api.js';
import { addOwner } from './data.js';

export async function getAllPosts() {
	return (await api.get('/Posts')).results;
}

export async function getPostById(id) {
	return api.get(`/Posts/${id}`);
}

export async function createPost(post) {
	addOwner(post);
	return api.post('/Posts', post);
}

export async function deletePost(postId) {
	return api.del(`/Posts/${postId}`);
}

export async function editPost(postId, newPost) {
	return api.put(`/Posts/${postId}`, newPost);
}