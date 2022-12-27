import { html, render as litRender } from "../../lib/lit-html.js";

const infoWindowTemplate = (carObj, clickHandler) => html`
	<button @click=${clickHandler} type="button" class="btn-close" aria-label="Close"></button>
	<h4>${carObj.carName}</h4>
	<p id="extra-info">${carObj.extraInfo != '' ? carObj.extraInfo : 'Extra info has not been provided.'}</p>
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
	// console.log(posts)
	ev.preventDefault();

	if (ev.target.classList.contains("show-more-info-btn")) {
		const cardObjectId = ev.target.dataset.objectId;
		const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');

		litRender(infoWindowTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	}
}