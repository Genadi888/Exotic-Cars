import { createComment } from "/src/api/comments.js";

export function getPublishCommentBtnHandler(ctx, cardObjectId) {
	return async ev => {
		ev.preventDefault();
		const button = ev.target; //? we save reference to the element in a variable, because later ev.target becomes something else
		const textarea = button.parentElement.querySelector('textarea#comment-input');

		button.disabled = true;
	
		try {
			await createComment(
				{ commentText: textarea.value.trim() }, 
				ctx, button.dataset.repliedCommentId || null, 
				button.dataset.ownerNameOfRepliedComment || null, 
				button.dataset.repliedCommentId === undefined ? cardObjectId : null //? if repliedCommentId is missing, then the comment is not a reply
			);
	
			button.blur();
	
			textarea.value = '';
			button.textContent = 'Comment';
	
			delete button.dataset.repliedCommentId;
			delete button.dataset.ownerNameOfRepliedComment;
	
			ctx.refreshComments();
		} catch (error) {
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

				if (!textarea.value.match(/[\w'".-]{2,}/g) || textarea.value == '') {
					textarea.classList.add('is-invalid');
					span.style.display = 'unset';
					span.textContent = 'write at least one word';
				} else {
					textarea.classList.remove('is-invalid');
					span.style.display = 'none';
					button.removeAttribute('disabled');
				}
			}, 1000);
		}
	}
}