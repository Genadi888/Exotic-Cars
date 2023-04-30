import { createComment } from "/src/api/comments.js";
import { getCommentWindowTemplate } from "../infoWindowTemplates.js";

export async function publishCommentBtnHandler(ev) {
	ev.preventDefault();
	const button = ev.target; //? we save reference to the element in a variable, because later ev.target becomes something else
	const textarea = button.parentElement.querySelector('textarea#comment-input');

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

		const [commentWindowTemplate, commentsTemplatePromise] = getCommentWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow), publishCommentBtnHandler, commentsDivClickHandler, getPublishCommentInputHandler(), ctx);
		
		//? refresh the moreInfoWindow view
		litRender(commentWindowTemplate, moreInfoWindow);

		//? we wait for the comments to appear and then we start observing them
		commentsTemplatePromise.then(() => startObservingComments([...moreInfoWindow.querySelectorAll('p.comment-text')]));
	} catch (error) {
		alert(error);
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