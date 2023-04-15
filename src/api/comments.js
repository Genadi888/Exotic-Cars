import * as api from './api.js';
import { addEntryWithUserPointer } from './data.js';

export async function createComment(comment, ctx, idOfRepliedComment, ownerNameOfRepliedComment, postId) {
	addEntryWithUserPointer(comment, 'owner');
	// console.log(comment);
	
	comment.ownerName = ctx.user.username;

	if (idOfRepliedComment) {
		comment.idOfRepliedComment = idOfRepliedComment;
	}
	if (ownerNameOfRepliedComment) {
		comment.ownerNameOfRepliedComment = ownerNameOfRepliedComment;
	}
	if (postId) {
		comment.postId = postId;
	}

	return api.post(`/Comments`, comment);
}

export async function getRepliesForAComment(idOfRepliedComment) {
	return (await api.post(`/functions/getRepliesForAComment`, { idOfRepliedComment })).result;
}

export async function getCommentsOfAPost(postId) {
	return (await api.post(`/functions/getCommentsOfAPost`, { postId })).result;
}