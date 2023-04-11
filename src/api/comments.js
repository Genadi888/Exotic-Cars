import * as api from './api.js';
import { addEntryWithUserPointer } from './data.js';

export async function createComment(comment, ctx, idOfRepliedComment) {
	addEntryWithUserPointer(comment, 'owner');
	// console.log(comment);
	comment.ownerName = ctx.user.username;
	if (idOfRepliedComment) {
		comment.idOfRepliedComment = idOfRepliedComment;
	}
	return api.post(`/Comments`, comment);
}

export async function getRepliesForAComment(idOfRepliedComment) {
	return (await api.post(`/functions/getRepliesForAComment`, { idOfRepliedComment })).result;
}

export async function getAllComments() {
	return (await api.post(`/functions/getComments`)).result;
}