import { html, render as litRender } from "../../lib/lit-html.js";

const infoWindowTemplate = (carObj, clickHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>${carObj.carName}</h4>
	<p id="extra-info">${carObj.extraInfo != '' ? carObj.extraInfo : 'Extra info has not been provided.'}</p>
`;

const reportWindowTemplate = (carObj, clickHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>Report this post</h4>
	
	<form id="report-form">
		<div class="form-floating">
			<textarea class="form-control report-reason"
				name="reason" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
			<label for="floatingTextarea">Write a report reason</label>
			<span class="invalid-span" id="textarea-invalid-span">Invalid report reason</span>
		</div>
		<input class="btn btn-danger" type="submit" value="Report">
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
	ev.preventDefault();
	const cardObjectId = ev.target.dataset.objectId;
	const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
	const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');

	if (ev.target.classList.contains("show-more-info-btn")) {
		litRender(infoWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	} else if (ev.target.classList.contains("flag")) {
		litRender(reportWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	}
}