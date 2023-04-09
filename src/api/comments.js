import * as api from './api.js';
import { addEntryWithUserPointer } from './data.js';

export async function createComment(comment, ctx) {
	addEntryWithUserPointer(comment, 'owner');
	// console.log(comment);
	comment.ownerName = ctx.user;
	return api.post(`/Comments`, comment);
}

export async function getAllComments() {
	return api.get(`/Comments`);
}