import * as api from './api.js';
import { addOwner, addUserWhoLiked } from './data.js';

export async function getAllPosts(ctx) {
	const allPosts = (await api.get('/Posts')).results;
	const allLikes = (await api.get('/PostsLikes')).results;

	for (const post of allPosts) {
		post.likesCount = allLikes
			.filter(likeObj => {
				if (likeObj.postId === post.objectId) {
					if (likeObj.userWhoLiked.objectId === ctx.user?.id) {
						post.userHasLikedThisPost = true;
					}
					return true;
				}
			}).length;
	}

	return allPosts;
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

export async function likePost(postId) {
	const like = { postId };
	addUserWhoLiked(like);
	return api.post(`/functions/likePost`, like);
}

export async function disLikePost(postId, userId) {
	const { objectId: likeObjId } = 
	(await api.get(`/PostsLikes?where={"postId": "${postId}", 
	"userWhoLiked": {"__type":"Pointer","className":"_User","objectId":"${userId}"}}`)).results[0];
	return api.del(`/PostsLikes/${likeObjId}`);
}
