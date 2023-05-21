import * as api from './api.js';
import { addEntryWithUserPointer } from './data.js';

export async function createOrEditComment(comment, ctx, idOfRepliedComment, ownerNameOfRepliedComment, postId, edit) {
	addEntryWithUserPointer(comment, 'owner');
	// console.log(comment);
	
	if (idOfRepliedComment) {
		comment.idOfRepliedComment = idOfRepliedComment;
	}
	if (ownerNameOfRepliedComment) {
		comment.ownerNameOfRepliedComment = ownerNameOfRepliedComment;
	}
	if (postId && edit === null) { //? If the comment is being edited, there is no need to set a value to postId because the server ignores it in this case. 
		comment.postId = postId;
	}

	return api.post(`/functions/${edit ? 'edit' : 'create'}Comment`, comment);
}

export async function deleteComment(objectId) {
	return api.del(`/Comments/${objectId}`);
}

export async function likeComment(commentId) {
	const likeObj = { commentId };
	addEntryWithUserPointer(likeObj, 'userWhoLiked');
	return api.post(`/functions/likeComment`, likeObj);
}

export async function unlikeComment(commentId) {
	return api.post(`/functions/unlikeComment`, { commentId });
}

export async function getRepliesForAComment(idOfRepliedComment) {
	return (await api.post(`/functions/getRepliesForAComment`, { idOfRepliedComment })).result;
}

export async function getCommentsOfAPost(postId) {
	return (await api.post(`/functions/getCommentsOfAPost`, { postId })).result;
}