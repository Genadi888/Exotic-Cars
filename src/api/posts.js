import * as api from './api.js';
import { addOwner } from './data.js';

export async function getAllPosts() {
	return api.get('/Posts');
}

export async function getPostById(id) {
	return api.get('/Posts/' + id);
}

export async function createPost(post) {
	addOwner(post);
	return api.post('/Posts', post);
}

// export async function createImage(image, post) {
// 	// console.log({ imageFile: image, post: image.post })
// 	linkPost(image, post.objectId);
// 	return api.post('/PostsImages', { imageFile: image, post: image.post});
// }