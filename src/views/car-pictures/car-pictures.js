import { html } from "../../lib/lit-html.js";
import { repeat } from "../../lib/directives/repeat.js";
import { until } from "../../lib/directives/until.js";
import { getAllPosts, getAllUnapprovedPosts } from "../../api/posts.js";
import { sectionClickHandler } from "./infoWindow/infoWindow.js";
import { setUpScrollToTop } from "./scrollToTop.js";
import { carPicturesTemplate } from "./carPicturesTemplate.js";
import { getApproveClickHandler, getDeleteHandler, getLikeClickHandler } from "./posts/postActions.js";
import { getSwitchToApprovalModeHandler } from "./posts/switchToApprovalModeHandler.js";
import { cardTemplate } from "./posts/cardTemplate.js";
import { getNoPostsTemplate } from "./posts/getNoPostsTemplate.js";
import { getUnapprovedPostsMessageTemplate } from "./posts/unapprovedPostsMessageTemplate.js";

export async function carPicturesView(ctx) {
	let posts = null;

	const getSectionContentTemplate = async (getNoPostsTemplate, postType) => {
		try {
			if (postType == 'unapproved') {
				posts = await getAllUnapprovedPosts();
			} else {
				posts = await getAllPosts(ctx);
			}
		} catch (error) {
			alert(error.message);
			throw error;
		}
		
		if (posts.length == 0) {
			ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'flex-start';
		}

		return html`
			${
				posts.length > 0 ? 
				repeat(posts, post => post.objectId, post => cardTemplate(
					post, ctx.user,
					getDeleteHandler(ctx, post.objectId),
					getLikeClickHandler(post.objectId, ctx.user?.objectId),
					getApproveClickHandler(post.objectId, ctx.nestedShadowRoot.querySelector('section > .approval-btn')),
					postType == 'unapproved'
				)) : 
				getNoPostsTemplate(postType !== 'unapproved', ctx)
			}
		`
	}

	const loadingTemplate = () => html`
		<h1 id="loading">Loading posts<div class="loader"></div></h1>
	`

	let sectionContentPromise = getSectionContentTemplate(getNoPostsTemplate, ctx.hash == 'approval-mode' ? 'unapproved' : null);

	ctx.render(
		carPicturesTemplate(
			ev => sectionClickHandler(ev, posts, ctx),
			until(sectionContentPromise, loadingTemplate()),
			ctx.user?.isModerator ? getSwitchToApprovalModeHandler(
				ctx, 
				getNoPostsTemplate,
				loadingTemplate,
				getSectionContentTemplate,
				carPicturesTemplate,
				sectionClickHandler,
				posts
			) : null,
			ctx.user ? until(getUnapprovedPostsMessageTemplate(sectionContentPromise), null) : null,
		)
	);

	//? change to approval view if the hash contains "approval-mode"
	if (ctx.hash == 'approval-mode') {
		const button = ctx.nestedShadowRoot.querySelector('section > .approval-btn');
		button.click();
	}

	if (!ctx.user?.isModerator) {
		ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'space-around';
	} else {
		sectionContentPromise.then(() => {
			const card = ctx.nestedShadowRoot.querySelector('section > .card');
			if (card) {
				card.style['marginTop'] = '14px';
			}
		});
	}

	setUpScrollToTop(ctx);
}