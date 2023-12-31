import { html } from "../../../lib/lit-html.js";
import { repeat } from "../../../lib/directives/repeat.js";
import { cardTemplate } from "./cardTemplate.js";
import { getApproveClickHandler, getDeleteHandler, getLikeClickHandler } from "./postActions.js";
import { populatePostsArr } from "./populatePostsArr.js";

export async function getSectionContentTemplate (getNoPostsTemplate, postsType, posts, generatorsObject, ctx, arrOfPostObjectIds, pageUrlSrchTextPromise, windowPath) {
	//? the popstate may change while some post promises are still pending so we create this variable to prevent the rendering of posts in a wrong view
	let initialPopstateChanges = Number(sessionStorage.getItem('popstateChanges') || 0); 
	
	//? the window path may change while some post promises are still pending so we create this variable to prevent the rendering of posts in a wrong view
	const prevWindowPath = windowPath || ctx.canonicalPath;

	if (pageUrlSrchTextPromise) {
		await pageUrlSrchTextPromise; //? we wait for the searching of post object ids and the initialization of srch. gens. to finish
	}

	try {
		//? The following function may return a rejected promise, if views changed while some post promises were still pending.
		await populatePostsArr(ctx, posts, generatorsObject, postsType, initialPopstateChanges, prevWindowPath, arrOfPostObjectIds?.length > 0);
	} catch (error) {
		console.error(error);
		throw error;
	}
	
	if (posts.length == 0) {
		ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'flex-start';
	}

	return html`
		${
			posts.length > 0 ? 
			repeat(posts, post => post.objectId, post => cardTemplate(
				post, 
				ctx.user,
				getDeleteHandler(ctx, post.objectId),
				getLikeClickHandler(post.objectId, ctx.user?.objectId),
				getApproveClickHandler(post.objectId, ctx.nestedShadowRoot.querySelector('section > .approval-btn')),
				postsType == 'unapproved'
			)) : 
			getNoPostsTemplate(postsType !== 'unapproved', ctx, arrOfPostObjectIds?.length > 0)
		}
	`
}