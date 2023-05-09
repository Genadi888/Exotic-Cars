import { commentTemplate } from "./commentTemplate.js";
import { getInfoWindowCommentClickListener } from "./moreInfoWindowCommentClickListener.js";
import { refreshComments, commentsData } from "./refreshComments.js";

export function commentBtnHandler(ev, posts, ctx, showOrHideWindow, miscState) { //? something like an entry point for the whole comment thing
	ev.preventDefault();

	const moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');

	commentsData.cardObjectId = ev.target.dataset.objectId;
	commentsData.selectedPost = Object.values(posts).find(postObj => postObj.objectId === commentsData.cardObjectId);
	commentsData.moreInfoWindow = moreInfoWindow;
	commentsData.showOrHideWindow = showOrHideWindow;
	commentsData.ctx = ctx;
	commentsData.ctx.refreshComments = refreshComments;
	commentsData.miscState = miscState;


	moreInfoWindow.addEventListener('click',
	miscState.moreInfoWindowCommentClickListener = getInfoWindowCommentClickListener(commentTemplate, ctx));
	
	commentsData.moreInfoWindow.classList.add('dimmed');

	refreshComments();
	commentsData.showOrHideWindow(commentsData.moreInfoWindow);
}