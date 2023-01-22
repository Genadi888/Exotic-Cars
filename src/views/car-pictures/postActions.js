import { deletePost, unlikePost, likePost, approvePost } from "../../api/posts.js";

export function getDeleteHandler(ctx, postObjectId) {
	return async () => {
		if (confirm('You are going to DELETE this post! Proceed?')) {
			try {
				await deletePost(postObjectId);
				ctx.page.redirect('/car-pictures');
			} catch (error) {
				alert(error.message);
				throw error;
			}
		}
	}
}

export function getLikeClickHandler(postObjectId, userId) {
	return async ev => {
		const likeBtn = ev.currentTarget;

		if (likeBtn.classList.contains('user-has-liked')) {
			try {
				likeBtn.classList.remove('user-has-liked');
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes - 1;
				await unlikePost(postObjectId, userId);
			} catch (error) {
				alert(error.message);
				likeBtn.classList.add('user-has-liked')
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes + 1;
				throw error;
			}
		} else {
			try {
				likeBtn.classList.add('user-has-liked')
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes + 1;
				await likePost(postObjectId);	
			} catch (error) {
				alert(error.message);
				likeBtn.classList.remove('user-has-liked');
				likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes - 1;
				throw error;
			}
		}
	}
}

export function getApproveClickHandler(postObjectId, switchToApprovalModeBtn) {
	return async ev => {
		try {
			await approvePost(postObjectId);
			switchToApprovalModeBtn.click();
		} catch (error) {
			alert(error.message);
			throw error;
		}
	}
}