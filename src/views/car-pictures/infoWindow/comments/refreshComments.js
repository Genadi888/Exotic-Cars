import { render as litRender } from "/src/lib/lit-html.js";
import { startObservingComments } from "./commentsObserver.js";
import { commentTemplate } from "./commentTemplate.js";
import { getCommentWindowTemplate } from "./commentWindowTemplate.js";
import { getCommentsDivClickHandler } from "./commentsDivClickHandler.js";
import { getPublishCommentInputHandler, getPublishCommentBtnHandler } from "./publishCommentHandlers.js";
import { getInfoWindowCommentClickListener } from "./moreInfoWindowCommentClickListener.js";

export const commentsData = { //? filled from the initial load
    cardObjectId: null,
    selectedPost: null,
    moreInfoWindow: null,
    showOrHideWindow: null,
    ctx: null,
    miscState: null
};

export function refreshComments() { 
	const [commentWindowTemplate, commentsTemplatePromise] = 
	getCommentWindowTemplate(
		commentsData.selectedPost,
		() => commentsData.showOrHideWindow(commentsData.moreInfoWindow),
        getPublishCommentBtnHandler(commentsData.ctx,
            commentsData.cardObjectId,
            commentsData.moreInfoWindow,
        ),
		getCommentsDivClickHandler(commentsData.miscState, commentsData.ctx),
		getPublishCommentInputHandler(),
		commentsData.ctx
	);

	litRender(commentWindowTemplate, commentsData.moreInfoWindow);

	//? we wait for the comments to appear and then we start observing them
	commentsTemplatePromise.then(() => startObservingComments([...commentsData.moreInfoWindow.querySelectorAll('p.comment-text')]));

	commentsData.moreInfoWindow.addEventListener('click', 
	commentsData.miscState.moreInfoWindowCommentClickListener = getInfoWindowCommentClickListener(commentTemplate, commentsData.ctx));

    // commentsData.showOrHideWindow(commentsData.moreInfoWindow);
}