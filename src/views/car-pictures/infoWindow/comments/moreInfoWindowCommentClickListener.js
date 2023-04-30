import { getRepliesForAComment } from "/src/api/comments.js";
import { repeat } from "/src/lib/directives/repeat.js";
import { until } from "/src/lib/directives/until.js";
import { html, render as litRender } from "/src/lib/lit-html.js";
import { startObservingComments } from "./commentsObserver.js";

export function getMoreInfoWindowCommentClickListener(commentTemplate) {
	return async ev => {
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

					return html`${repeat(replies, reply => reply.objectId, reply => commentTemplate(reply, true, ctx))}`
				}

				const repliesTemplatePromise = getRepliesTemplate();

				litRender(until(repliesTemplatePromise, html`<div class="comments-spinner comments-spinner-replies"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`), repliesDiv);

				//? we wait for the replies to appear and then we start observing them
				repliesTemplatePromise.then(() => startObservingComments([...repliesDiv.querySelectorAll('p.comment-text')]))
			}
		}
	}
}