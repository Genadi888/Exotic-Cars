import { reportObject } from "../../api/posts.js";
import { render as litRender } from "../../lib/lit-html.js";
import { commentWindowTemplate, infoWindowTemplate, reportWindowTemplate } from "./infoWindowTemplates.js";

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
	} else if (ev.target.classList.contains("comment-btn"))  {
		ev.preventDefault();
		const cardObjectId = ev.target.dataset.objectId;
		const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
		moreInfoWindow.classList.add('dimmed');
		
		litRender(commentWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	}
}