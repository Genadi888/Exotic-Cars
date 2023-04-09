import { createComment } from "../../api/comments.js";
import { reportObject } from "../../api/posts.js";
import { render as litRender } from "../../lib/lit-html.js";
import { until } from "/src/lib/directives/until.js";

import { getCommentWindowTemplate, infoWindowTemplate, reportWindowTemplate } from "./infoWindowTemplates.js";

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
		
		litRender(getCommentWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow), commentBtnHandler), moreInfoWindow);

		async function commentBtnHandler(ev) {
			const commentText = ev.target.parentElement.querySelector('textarea#comment-input').value.trim();

			try {
				await createComment({ commentText }, ctx);
			} catch (error) {
				alert(error);
			}
		}

		moreInfoWindow.addEventListener('click', ev => {
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
			}
		});

		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const commentTextElement = entry.target;
	
				//? Here we get the raw value of the variable (as string):
				const cssVarForMaxHeight = getComputedStyle(commentTextElement.closest('#comments'))
					.getPropertyValue('--commentTextMaxHeight')
					.trim();
	
				//? If the variable's value ends with "vh", it will be converted to pixels, otherwise, the value will not be changed.
				const maxHeight = Math.floor(cssVarForMaxHeight.endsWith('vh') ?
					document.documentElement.clientHeight * +cssVarForMaxHeight.slice(0, -2) / 100 :
					+cssVarForMaxHeight.slice(0, -2));
	
				//? since we are observing only a single element, so we access the first element in entries array
				const commentTextHeight = Math.floor(+entry.borderBoxSize[0].blockSize);
				const commentTextWrapper = commentTextElement.parentElement;
	
				if (commentTextWrapper.style.maxHeight.trim() !== cssVarForMaxHeight //? Here we check if the current max-height differs from our CSS variable for max-height (this can occur after resizing).
					&& commentTextWrapper.style.maxHeight.match(/\d/) //? Here we make sure that both values are valid (different from "unset" or something else).
					&& cssVarForMaxHeight.match(/\d/)) {
	
					// console.log(commentTextWrapper.style.maxHeight.trim(), cssVar);
					commentTextWrapper.style.maxHeight = cssVarForMaxHeight;
				}
	
				const labelToClickOn = commentTextWrapper.querySelector('label[for="overflow-control-btn"]');
				const inputCheckbox = commentTextWrapper.querySelector('#overflow-control-btn');
	
				if (commentTextHeight > commentTextWrapper.clientHeight) { 
					labelToClickOn.style.display = 'block'; //? If the comment text is overflowing outside the wrapper, the "show-more" label will be shown.
				}
				else if (commentTextHeight <= maxHeight || maxHeight == 0) { 
					//? If the comment text is less than our desired max-height, the label will be hidden as there is no need for it.
					//? The label will also be hidden if the max-height is removed (screen becomes too large).
	
					labelToClickOn.style.display = 'none';
					if (inputCheckbox.classList.contains('overflow-control-btn-pressed')) {
						labelToClickOn.click(); //? Here we simulate a click, if the label is hidden after it has been clicked (last text was "show less"). We do that to prevent unwanted behavior.
					}
				}
			}
		});

		for (const commentTextElement of [...moreInfoWindow.querySelectorAll('p.comment-text')]) {
			resizeObserver.observe(commentTextElement, { box: 'border-box' });
		}

		showOrHideWindow(moreInfoWindow);
	}
}