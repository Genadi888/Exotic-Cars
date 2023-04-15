import { createComment, getRepliesForAComment } from "../../api/comments.js";
import { reportObject } from "../../api/posts.js";
import { repeat } from "../../lib/directives/repeat.js";
import { until } from "../../lib/directives/until.js";
import { html, render as litRender } from "../../lib/lit-html.js";
import { startObservingComments } from "./commentsObserver.js";
import { commentTemplate, getCommentWindowTemplate, infoWindowTemplate, reportWindowTemplate } from "./infoWindowTemplates.js";

let moreInfoWindowCommentClickListener;

function showOrHideWindow(moreInfoWindow) {
	const delay = window.matchMedia('(prefers-reduced-motion)').matches ? '1ms' : '0.5s';
	moreInfoWindow.style.transition = `opacity ${delay} ease-in-out`;

	if (+moreInfoWindow.style.opacity === 0) {
		moreInfoWindow.style['pointer-events'] = 'unset';
		moreInfoWindow.style.opacity = 1;
	} else {
		moreInfoWindow.addEventListener('transitionend', ev => {
			if (ev.propertyName == 'opacity' && moreInfoWindow.style.opacity == 0) {
				moreInfoWindow.style['pointer-events'] = 'none';
			}
		});
		moreInfoWindow.style.opacity = 0;
		moreInfoWindow.removeEventListener('click', moreInfoWindowCommentClickListener);
	}
}

/**
 * 
 * @param {Event} ev 
 * @param {Array} posts 
 */

export function sectionClickHandler(ev, posts, ctx) {
	if (ev.target.classList.contains("show-more-info-btn")) {
		ev.preventDefault();
		const cardObjectId = ev.target.dataset.objectId;
		const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
		moreInfoWindow.classList.remove('dimmed');

		litRender(infoWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	} else if (ev.target.classList.contains("flag")) {
		ev.preventDefault();
		const cardObjectId = ev.target.dataset.objectId;
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
		moreInfoWindow.classList.remove('dimmed');

		litRender(reportWindowTemplate(() => showOrHideWindow(moreInfoWindow), reportSubmitHandler, getFormInputEventHandler, getTextareaInputHandler), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);

		function getTextareaInputHandler() {
			let timeout;

			return (ev) => {
				const textarea = ev.currentTarget;
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					const span = textarea.parentElement.querySelector('#textarea-invalid-span');

					if (textarea.value.match(/[\w'".-]{2,}/g)?.length < 4 || (!textarea.value.match(/[\w'".-]{2,}/g) && textarea.value != '')) {
						textarea.classList.add('is-invalid');
						span.style.display = 'unset';
						span.textContent = 'write at least 4 words';
					} else {
						textarea.classList.remove('is-invalid');
						span.style.display = 'none';
					}
				}, 1000);
			}
		}

		function getFormInputEventHandler() {
			let timeout;

			return ev => {
				clearTimeout(timeout);

				const form = ev.currentTarget;
				const textarea = form.querySelector('textarea');
				const submitBtn = form.querySelector('input[type="submit"]');
				submitBtn.disabled = true;

				timeout = setTimeout(() => {
					const reasonTextIsNotEmpty = textarea.value != '';

					if (!form.querySelector('.is-invalid') && reasonTextIsNotEmpty) {
						submitBtn.removeAttribute('disabled');
					}
					else {
						submitBtn.disabled = true;
					}
				}, 1000)
			}
		}

		async function reportSubmitHandler(ev) {
			ev.preventDefault();
			const form = ev.currentTarget;
			const textarea = form.querySelector('textarea');
			const submitBtn = form.querySelector('input[type="submit"]');
			submitBtn.disabled = true;
			submitBtn.value = "Reporting...";

			const formData = new FormData(form);

			const report = {
				reason: formData.get('reason'),
				idOfReportedObject: cardObjectId,
				classOfReportedObject: 'Posts',
			}

			try {
				await reportObject(report);
				textarea.value = '';
				showOrHideWindow(moreInfoWindow);
			} catch (error) {
				alert(error.message);
			} finally {
				submitBtn.removeAttribute('disabled');
				submitBtn.value = "Report";
			}
		}
	} else if (ev.target.classList.contains("comment-btn")) {
		ev.preventDefault();

		const cardObjectId = ev.target.dataset.objectId;
		const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
		moreInfoWindow.classList.add('dimmed');

		const [commentWindowTemplate, commentsTemplatePromise] = getCommentWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow), publishCommentBtnHandler, commentsDivClickHandler);

		litRender(commentWindowTemplate, moreInfoWindow);

		//? we wait for the comments to appear and then we start observing them
		commentsTemplatePromise.then(() => startObservingComments([...moreInfoWindow.querySelectorAll('p.comment-text')]));

		async function publishCommentBtnHandler(ev) {
			ev.preventDefault();
			const button = ev.target; //? we save reference to the element in a variable, because later ev.target becomes something else
			const textarea = button.parentElement.querySelector('textarea#comment-input');

			try {
				await createComment({ commentText: textarea.value.trim() }, ctx, button.dataset.repliedCommentId || null, button.dataset.ownerNameOfRepliedComment || null);
				button.blur();

				textarea.value = '';
				button.textContent = 'Comment';

				delete button.dataset.repliedCommentId;
				delete button.dataset.ownerNameOfRepliedComment;

				const [commentWindowTemplate, commentsTemplatePromise] = getCommentWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow), publishCommentBtnHandler, commentsDivClickHandler);
				
				//? refresh the moreInfoWindow view
				litRender(commentWindowTemplate, moreInfoWindow);

				//? we wait for the comments to appear and then we start observing them
				commentsTemplatePromise.then(() => startObservingComments([...moreInfoWindow.querySelectorAll('p.comment-text')]));
			} catch (error) {
				alert(error);
			}
		}

		function commentsDivClickHandler(ev) {
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
			} else {
				const focusedComment = ev.target.closest('#comments').querySelector('.focused-comment');
				if (focusedComment) {
					ev.target.closest('#comments').querySelector('.focused-comment')?.classList.remove('focused-comment'); //? unfocus comment
					const publishbtn = ev.target.closest('#comments').parentElement.querySelector('#publish-comment > button');
					publishbtn.textContent = 'Comment';
					delete publishbtn.dataset.repliedCommentId;
					delete publishbtn.dataset.ownerNameOfRepliedComment;
				}
			}
		}

		moreInfoWindow.addEventListener('click', moreInfoWindowCommentClickListener = async ev => {
			if (ev.target.getAttribute('for') == 'overflow-control-btn') {
				const commentTextWrapper = ev.target.parentElement;
				const button = commentTextWrapper.querySelector('#overflow-control-btn');
				const cssVarForMaxHeight = getComputedStyle(commentTextWrapper.closest('#comments')).getPropertyValue('--commentTextMaxHeight').trim();

				if (button.classList.contains('overflow-control-btn-pressed')) {
					button.classList.remove('overflow-control-btn-pressed');
					commentTextWrapper.style.maxHeight = cssVarForMaxHeight; //? we shrink the wrapper
				} else {
					button.classList.add('overflow-control-btn-pressed');
					commentTextWrapper.style.maxHeight = 'unset'; //? we remove the height limitation
				}
			} else if (ev.target.classList.contains('show-replies-lines')) {
				const repliesDiv = ev.target.parentElement.querySelector('.comment-replies');

				if (repliesDiv.style.display == 'none' || repliesDiv.style.display == '') {
					ev.target.textContent = 'Hide replies';
					repliesDiv.style.display = 'block';
				} else if (repliesDiv.style.display == 'block') {
					ev.target.textContent = 'Show replies';
					repliesDiv.style.display = 'none';
				}

				if (!repliesDiv.hasChildNodes()) { //? if repliesDiv is empty
					const getRepliesTemplate = async () => {
						const repliedCommentId = repliesDiv.closest('.comment').dataset.objectId;
						const replies = await getRepliesForAComment(repliedCommentId);

						return html`${repeat(replies, reply => reply.objectId, reply => commentTemplate(reply, true))}`
					}

					const repliesTemplatePromise = getRepliesTemplate();

					litRender(until(repliesTemplatePromise, html`<div class="comments-spinner comments-spinner-replies"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`), repliesDiv);

					//? we wait for the replies to appear and then we start observing them
					repliesTemplatePromise.then(() => startObservingComments([...repliesDiv.querySelectorAll('p.comment-text')]))
				}
			}
		});

		showOrHideWindow(moreInfoWindow);
	}
}