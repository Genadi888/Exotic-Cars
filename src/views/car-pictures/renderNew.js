import { html } from "../../lib/lit-html.js";
import { until } from "../../lib/directives/until.js";
import { get2SearchedPostObjects, get2UnapprovedSearchedPostObjects } from "../../api/posts.js";
import { sectionClickHandler } from "./infoWindow/infoWindow.js";
import { carPicturesTemplate } from "./carPicturesTemplate.js";
import { getSwitchToApprovalModeHandler } from "./posts/switchToApprovalModeHandler.js";
import { getNoPostsTemplate } from "./posts/getNoPostsTemplate.js";
import { getUnapprovedPostsMessageTemplate } from "./posts/unapprovedPostsMessageTemplate.js";
import { getSectionContentTemplate } from "./posts/sectionContentTemplate.js";
import { startObservingTheThirdLastCard } from "./posts/startObservingTheThirdLastCard.js";
import { searchHandler } from "./search/searchHandler.js";
import { setUpScrollToTop } from "./scrollToTop.js";
import { generatorsObject } from "./generatorsObject.js";
import { checkIfRenderShouldStop } from "./checkIfRenderShouldStop.js";
import { srchForPostIdsAndInitSrchGens } from "./srchForPostsAndInitSrchGens.js";

const loadingTemplate = () => html`
	<div id="loader-wrapper">
		<h1 id="loading">Loading posts<div class="loader"></div>
		</h1>
	</div>
`

let miscStuffSetUp = false;

let portionsRendered = 0;

let unapprovedPostsMessageTemplate = null;

export function resetState(posts) {
	portionsRendered = 0;
	posts.length = 0;
	generatorsObject.reset();
}

export async function renderNew(ctx, posts, arrOfPostObjectIds = [], pageUrlSrchText, windowPath, searchHandlerText) {
	if (checkIfRenderShouldStop(arrOfPostObjectIds, generatorsObject, ctx)) {
		return;
	}

	if ((generatorsObject.asyncSearchPostsGenerator === null && ctx.hash != 'approval-mode'
		|| generatorsObject.asyncUnapprovedSearchPostsGenerator === null && ctx.hash == 'approval-mode')
		&& arrOfPostObjectIds?.length > 0) {

		//? Get a new search posts generator with the new post object ids.

		if (ctx.hash == 'approval-mode') {
			generatorsObject.asyncUnapprovedSearchPostsGenerator = get2UnapprovedSearchedPostObjects(arrOfPostObjectIds);
			generatorsObject.asyncUnapprovedSearchPostsGeneratorIsDone = false;
		} else {
			generatorsObject.asyncSearchPostsGenerator = get2SearchedPostObjects(arrOfPostObjectIds);
			generatorsObject.asyncSearchPostsGeneratorIsDone = false;
		}
	}

	let pageUrlSrchTextPromise = null;
	if (pageUrlSrchText) {
		pageUrlSrchTextPromise = srchForPostIdsAndInitSrchGens(ctx, pageUrlSrchText, arrOfPostObjectIds, generatorsObject);
	}

	const sectionContentPromise = getSectionContentTemplate(
		getNoPostsTemplate,
		ctx.hash == 'approval-mode' ? 'unapproved' : null,
		posts,
		generatorsObject,
		ctx,
		arrOfPostObjectIds,
		pageUrlSrchTextPromise,
		windowPath
	);

	if (posts.length > 0) {
		//? If we already have 2 posts, the displaying of the "loading" template is avoided and the posts are shown after they have loaded.
		try {
			await sectionContentPromise; //? we wait for the two cards to show up on the screen
		} catch (error) {
			//? The sectionContentPromise may reject, if views changed while some post promises were still pending.
			console.error(error)
			return;
		}
	}

	//? If we already got the message, there is no need to get it again.
	if (ctx.user && (unapprovedPostsMessageTemplate === null || posts.length == 0)) {
		unapprovedPostsMessageTemplate = until(getUnapprovedPostsMessageTemplate(sectionContentPromise), null);
	}

	ctx.render(
		carPicturesTemplate(
			ev => sectionClickHandler(ev, posts, ctx),
			until(sectionContentPromise, loadingTemplate()),
			ctx.user?.isModerator ? getSwitchToApprovalModeHandler(ctx) : null,
			ctx.user ? unapprovedPostsMessageTemplate : null,
			ev => searchHandler(renderNew.bind(null, ctx, posts), ev, resetState.bind(null, posts), ctx),
			ctx,
			Boolean(arrOfPostObjectIds)
		)
	);

	ctx.nestedShadowRoot.querySelector('#postsSearchInput').value = pageUrlSrchText || searchHandlerText || '';
	if ((arrOfPostObjectIds == null || arrOfPostObjectIds?.length == 0) && posts.length == 0 && !pageUrlSrchText) {
	}

	if (!miscStuffSetUp) {
		setUpScrollToTop(ctx);
		miscStuffSetUp = true;
	}

	try {
		await sectionContentPromise; //? we wait for the two cards to show up on the screen
	} catch (error) {
		//? the sectionContentPromise may reject if views change durring it "pending" state
		console.error(error)
		return;
	}

	portionsRendered++;

	if (portionsRendered < 2) {
		renderNew(ctx, posts, arrOfPostObjectIds); //? render one more portion
	} else {
		portionsRendered = 0;
		startObservingTheThirdLastCard(ctx, renderNew.bind(null, ctx, posts, arrOfPostObjectIds)); //? When user sees the third card, repeat the rendering cycle.
	}
}