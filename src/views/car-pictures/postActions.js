import { deletePost, disLikePost, likePost } from "../../api/posts.js";

export function getDeleteHandler(ctx, postObjectId) {
	return async () => {
		if (confirm('You are going to DELETE this post! Proceed?')) {
			await deletePost(postObjectId);
			ctx.page.redirect('/car-pictures');
		}
	}
}

export function getLikeClickHandler(postObjectId, userId) {
	return async ev => {
		const likeBtn = ev.currentTarget;

		if (likeBtn.classList.contains('user-has-liked')) {
			try {
				likeBtn.classList.remove('user-has-liked');
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes - 1 === 0 ? '' : +likeBtn.parentElement.dataset.likes - 1;
				await disLikePost(postObjectId, userId);
			} catch (error) {
				alert(error.message);
				likeBtn.classList.add('user-has-liked')
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes + 1;
			}
		} else {
			try {
				likeBtn.classList.add('user-has-liked')
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes + 1;
				await likePost(postObjectId);	
			} catch (error) {
				likeBtn.classList.remove('user-has-liked');
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes - 1 === 0 ? '' : +likeBtn.parentElement.dataset.likes - 1;
			}
		}
	}
}