import { render as litRender } from "/src/lib/lit-html.js";
import { commentBtnHandler } from "./comments/commentBtnHandler.js";
import { extraInfoTemplate } from "./infoWindowTemplates.js";

const miscState = { //? object is stored in the dynamic memory (heap) and its properties can be dynamicly modified
	moreInfoWindowCommentClickListener: null,
	commentMoreBtnClicked: false,
}

function showOrHideWindow(moreInfoWindow) {
	const delay = window.matchMedia('(prefers-reduced-motion)').matches ? '1ms' : '0.5s';
	moreInfoWindow.style.transition = `opacity ${delay} ease-in-out`;

	if (+getComputedStyle(moreInfoWindow).opacity === 0) {
		moreInfoWindow.style['pointer-events'] = 'unset';
		moreInfoWindow.style.opacity = 1;
	} else {
		//? here we clean up the publishComment section
		moreInfoWindow.querySelector('textarea').value = "";
		const dataset = moreInfoWindow.querySelector('#publish-comment>.btn-primary').dataset;
		Object.keys(dataset).forEach(key => delete dataset[key]);

		moreInfoWindow.style['pointer-events'] = 'none';
		moreInfoWindow.style.opacity = 0;
		moreInfoWindow.removeEventListener('click', miscState.moreInfoWindowCommentClickListener);
	}
}

export function sectionClickHandler(ev, posts, ctx) {
	if (ev.target.classList.contains("show-more-info-btn")) {
		ev.preventDefault();
		const cardObjectId = ev.target.dataset.objectId;
		const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
		const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
		moreInfoWindow.classList.remove('dimmed');

		litRender(extraInfoTemplate(selectedPost, () => showOrHideWindow(moreInfoWindow)), moreInfoWindow);
		showOrHideWindow(moreInfoWindow);
	} else if (ev.target.classList.contains("comment-btn")) {
		commentBtnHandler(ev, posts, ctx, showOrHideWindow, miscState);
	} else {
		miscState.commentMoreBtnClicked = false; //? we set this to false if the user has clicked outside the #comments div
	}
}