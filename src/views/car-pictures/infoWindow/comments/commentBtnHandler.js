import { refreshComments, commentsData } from "./refreshComments.js";

export function commentBtnHandler(ev, posts, ctx, showOrHideWindow, miscState) { //? something like an entry point for the whole comment thing
	ev.preventDefault();

	commentsData.cardObjectId = ev.target.dataset.objectId;
	commentsData.selectedPost = Object.values(posts).find(postObj => postObj.objectId === commentsData.cardObjectId);
	commentsData.moreInfoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');
	commentsData.showOrHideWindow = showOrHideWindow;
	commentsData.ctx = ctx;
	commentsData.ctx.refreshComments = refreshComments;
	commentsData.miscState = miscState
	
	commentsData.moreInfoWindow.classList.add('dimmed');

	refreshComments();
	commentsData.showOrHideWindow(commentsData.moreInfoWindow);
}