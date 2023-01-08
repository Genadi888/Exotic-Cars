import { reportObject } from "../../api/posts.js";
import { html, render as litRender } from "../../lib/lit-html.js";

const infoWindowTemplate = (carObj, clickHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>${carObj.carName}</h4>
	<p id="extra-info">${carObj.extraInfo != '' ? carObj.extraInfo : 'Extra info has not been provided.'}</p>
`;

const reportWindowTemplate = (clickHandler, onSubmit, getFormInputEventHandler, getInputHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>Report this post</h4>
	
	<form @input=${getFormInputEventHandler()} @submit=${onSubmit} id="report-form">
		<div class="form-floating">
			<textarea @input=${getInputHandler()} class="form-control report-reason"
				name="reason" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
			<label for="floatingTextarea">Write a report reason</label>
			<span class="invalid-span" id="textarea-invalid-span">Invalid report reason</span>
		</div>
		<input disabled class="btn btn-danger" type="submit" value="Report">
	</form>
`;

function showOrHideWindow(moreInfoWindow) {
	if (+moreInfoWindow.style.opacity == 0) {
		moreInfoWindow.style['z-index'] = 1;
		moreInfoWindow.style.opacity = 1;
	} else {
		moreInfoWindow.style.opacity = 0;
		moreInfoWindow.addEventListener('transitionend', ev => {
			if (ev.propertyName == 'opacity' && moreInfoWindow.style.opacity == 0) {
				moreInfoWindow.style['z-index'] = -1;
			}
		});
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

		litRender(infoWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	} else if (ev.target.classList.contains("flag")) {
		ev.preventDefault();
		const cardObjectId = ev.target.dataset.objectId;
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');

		litRender(reportWindowTemplate(() => showOrHideWindow(moreInfoWindow), reportSubmitHandler, getFormInputEventHandler, getTextareaInputHandler), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);

		function getTextareaInputHandler() {
			let timeout;
	
			return (ev) => {
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					const inputEl = ev.path[0];
					const span = inputEl.parentElement.querySelector('#textarea-invalid-span');
	
					if (inputEl.value.match(/[\w'".-]{2,}/g)?.length < 4 || (!inputEl.value.match(/[\w'".-]{2,}/g) && inputEl.value != '')) {
						inputEl.classList.add('is-invalid');
						span.style.display = 'unset';
						span.textContent = 'write at least 4 words';
					} else {
						inputEl.classList.remove('is-invalid');
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
	}
}