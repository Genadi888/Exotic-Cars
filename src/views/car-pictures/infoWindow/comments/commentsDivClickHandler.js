import { deleteComment } from "/src/api/comments.js";
import { likeComment, unlikeComment } from "/src/api/comments.js";

export function getCommentsDivClickHandler(miscState, ctx) {
	return async (ev) => {
		ev.preventDefault();
		if (ev.target.classList.contains('comment-reply-btn')) {
			const publishCommentSpan = ev.target.closest('#comment-section').querySelector('#publish-comment');
			const btn = publishCommentSpan.querySelector('.btn-primary');
			const comment = ev.target.closest('.comment');
	
			ev.target.closest('#comments').querySelector('.focused-comment')?.classList.remove('focused-comment'); //? unfocus other comment (if any)
			comment.classList.add('focused-comment');
	
			publishCommentSpan.querySelector('textarea#comment-input').focus();
			btn.textContent = 'Reply';
			btn.dataset.repliedCommentId = ev.target.dataset.objectId; //? we attach the id of the replied comment to the dataset so we can easily get it in "publishCommentBtnHandler"
			btn.dataset.ownerNameOfRepliedComment = ev.target.dataset.ownerName; //? we attach the owner's name of the replied comment to the dataset so we can easily get it in "publishCommentBtnHandler"
		} else if (ev.target.classList.contains('comment-like-btn') && ctx.user?.objectId != ev.target.dataset.ownerObjectId) {
			const likeBtn = ev.target;
			const commentObjectId = ev.target.dataset.objectId;
	
			if (likeBtn.classList.contains('user-has-liked-comment')) {
				try {
					likeBtn.classList.remove('user-has-liked-comment');
					likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes - 1;
					await unlikeComment(commentObjectId);
				} catch (error) {
					alert(error.message);
					likeBtn.classList.add('user-has-liked-comment')
					likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes + 1;
					throw error;
				}
			} else {
				try {
					likeBtn.classList.add('user-has-liked-comment')
					likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes + 1;
					await likeComment(commentObjectId);	
				} catch (error) {
					alert(error.message);
					likeBtn.classList.remove('user-has-liked-comment');
					likeBtn.parentElement.dataset.likes = +likeBtn.parentElement.dataset.likes - 1;
					throw error;
				}
			}
		} else if (ev.target.classList.contains('comment-more-btn')) {
			const commentActionsWrapper = ev.target.parentElement.parentElement;
			const extraCommentActions = commentActionsWrapper.querySelector('ul.extra-comment-actions');
			
			if (!miscState.commentMoreBtnClicked) {
				extraCommentActions.focus();
			}
			
			miscState.commentMoreBtnClicked = !miscState.commentMoreBtnClicked;
		} else if (ev.target.classList.contains('comment-delete-btn')) {
			ev.target.disabled = true;

			try {
				await deleteComment(ev.target.dataset.objectId);
				ev.target.removeAttribute('disabled');
				ctx.refreshComments()
			} catch (error) {
				alert(error);
				throw error;
			}
		}		
		
		if (!ev.target.classList.contains('comment-reply-btn')) {
			const focusedComment = ev.target.closest('#comments')?.querySelector('.focused-comment');
			if (focusedComment) {
				ev.target.closest('#comments').querySelector('.focused-comment')?.classList.remove('focused-comment'); //? unfocus comment
				const publishbtn = ev.target.closest('#comments').parentElement.querySelector('#publish-comment > button');
				publishbtn.textContent = 'Comment';
				delete publishbtn.dataset.repliedCommentId;
				delete publishbtn.dataset.ownerNameOfRepliedComment;
			}
		} 
	
		if (!ev.target.classList.contains('comment-more-btn')) {
			miscState.commentMoreBtnClicked = false; //? we set this to false if the user has clicked inside the #comments div
		}
	}
}