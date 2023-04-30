import { render as litRender } from "/src/lib/lit-html.js";
import { startObservingComments } from "./commentsObserver.js";
import { commentTemplate, getCommentWindowTemplate } from "../infoWindowTemplates.js";
import { getCommentsDivClickHandler } from "./commentsDivClickHandler.js";
import { getPublishCommentInputHandler, publishCommentBtnHandler } from "./publishCommentHandlers.js";
import { getMoreInfoWindowCommentClickListener } from "./moreInfoWindowCommentClickListener.js";

export function commentBtnHandler(ev, posts, ctx, showOrHideWindow, miscState) {
	ev.preventDefault();

	const cardObjectId = ev.target.dataset.objectId;
	const selectedPost = Object.values(posts).find(postObj => postObj.objectId === cardObjectId);
	const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
	moreInfoWindow.classList.add('dimmed');

	const [commentWindowTemplate, commentsTemplatePromise] = 
	getCommentWindowTemplate(
		selectedPost, 
		() => showOrHideWindow(moreInfoWindow), 
		publishCommentBtnHandler, 
		getCommentsDivClickHandler(miscState), 
		getPublishCommentInputHandler(), 
		ctx
	);

	litRender(commentWindowTemplate, moreInfoWindow);

	//? we wait for the comments to appear and then we start observing them
	commentsTemplatePromise.then(() => startObservingComments([...moreInfoWindow.querySelectorAll('p.comment-text')]));

	moreInfoWindow.addEventListener('click', 
	miscState.moreInfoWindowCommentClickListener = getMoreInfoWindowCommentClickListener(commentTemplate));

	showOrHideWindow(moreInfoWindow);
}