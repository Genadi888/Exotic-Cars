import { deletePost } from "../../api/posts.js";

export function getDeleteHandler(ctx, postObjectId) {
	return async () => {
		if (confirm('You are going to DELETE this post! Proceed?')) {
			await deletePost(postObjectId);
			ctx.page.redirect('/car-pictures');
		}
	}
}