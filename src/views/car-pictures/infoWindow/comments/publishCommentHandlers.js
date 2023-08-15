import { createOrEditComment } from "/src/api/comments.js";

export function getPublishCommentBtnHandler(ctx, postObjectId) {
	return async ev => {
		ev.preventDefault();
		const button = ev.target; //? we save reference to the element in a variable, because later ev.target becomes something else
		const textarea = button.parentElement.querySelector('textarea#comment-input');

		button.disabled = true;
	
		try {
			const commentObj = { commentText: textarea.value.trim() };

			if ('edit' in button.dataset) {
				commentObj.objectId = button.dataset.commentObjectId; //? we need the objectId to edit the comment
			}
			
			await createOrEditComment(
				commentObj,
				ctx,
				button.dataset.repliedCommentId || null, //? repliedCommentId is always an id of a main comment
				button.dataset.ownerNameOfRepliedComment || null,
				!('repliedCommentId' in button.dataset) ? postObjectId : null, //? If repliedCommentId is missing, then the comment is not a reply.
				'edit' in button.dataset || null
			);
	
			button.blur();
	
			textarea.value = '';
			button.textContent = 'Comment';
	
			delete button.dataset.repliedCommentId;
			delete button.dataset.ownerNameOfRepliedComment;
			delete button.dataset.edit;
	
			ctx.refreshComments();
		} catch (error) {
			button.removeAttribute('disabled');
			alert(error);
			throw error;
		}

	}

}

export function getPublishCommentInputHandler() {
	let timeout;

	return (ev) => {
		if (ev.target.id == 'comment-input') {
			const textarea = ev.target;
			const button = textarea.parentElement.querySelector('.btn-primary');
			button.disabled = true;
			clearTimeout(timeout);

			timeout = setTimeout(() => {
				const span = textarea.parentElement.querySelector('#textarea-invalid-span');

				if (!textarea.value.match(/[\w'".-]{2,}/g) && textarea.value != '') {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least one word';
				} else if (textarea.value.match(/[\w'".-]{2,}/g)) {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
					button.removeAttribute('disabled');
				} else if (textarea.value == '') {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
					button.disabled = true;
				}
			}, 1000);
		}
	}
}