import { html } from "../../lib/lit-html.js";
import { until } from "../../lib/directives/until.js";
import { get2PostObjects, get2UnapprovedPostObjects } from "../../api/posts.js";
import { sectionClickHandler } from "./infoWindow/infoWindow.js";
import { carPicturesTemplate } from "./carPicturesTemplate.js";
import { getSwitchToApprovalModeHandler } from "./posts/switchToApprovalModeHandler.js";
import { getNoPostsTemplate } from "./posts/getNoPostsTemplate.js";
import { getUnapprovedPostsMessageTemplate } from "./posts/unapprovedPostsMessageTemplate.js";
import { getSectionContentTemplate } from "./posts/sectionContentTemplate.js";
import { setUpMiscStuff } from "./posts/setUpMiscStuff.js";
import { startObservingTheThirdLastCard } from "./posts/startObservingTheThirdLastCard.js";

export async function carPicturesView(ctx) {
	const loadingTemplate = () => html`
		<h1 id="loading">Loading posts<div class="loader"></div>
		</h1>
	`
	const posts = [];
	const generatorsObject = {
		asyncPostsGenerator: get2PostObjects(),
		asyncPostsGeneratorIsDone: false,
		asyncUnapprovedPostsGenerator: get2UnapprovedPostObjects(),
		asyncUnapprovedPostsGeneratorIsDone: false,
	}
	let miscStuffSetUp = false;
	let portionsRendered = 0;

	async function renderNew() {
		if (generatorsObject.asyncPostsGeneratorIsDone
			|| generatorsObject.asyncUnapprovedPostsGeneratorIsDone) {
			//? If one of the generators is exhausted, don't bother rendering anything.
			return;
		}

		const sectionContentPromise = getSectionContentTemplate(
			getNoPostsTemplate,
			ctx.hash == 'approval-mode' ? 'unapproved' : null,
			posts,
			generatorsObject,
			ctx,
		);

		if (posts.length > 0) {
			//? If we already have 2 posts, the displaying of the "loading" template is avoided and the posts are shown after they have loaded.
			await sectionContentPromise;
		}

		/*
			? After awaiting the sectionContentPromise and resuming the execution of this async function,
			? we check if the page's hash is different from the hash in the "ctx" object 
			? (the post mode has been switched to something else 
			? while the sectionContentPromise was still in "pending" state). 
			? If this is the case we won't bother rendering anything into the section.
		*/
		if (window.location.hash.slice(1) !== ctx.hash) {
			return;
		}

		ctx.render(
			carPicturesTemplate(
				ev => sectionClickHandler(ev, posts, ctx),
				until(sectionContentPromise, loadingTemplate()),
				ctx.user?.isModerator ? getSwitchToApprovalModeHandler(ctx) : null,
				ctx.user ? until(getUnapprovedPostsMessageTemplate(sectionContentPromise), null) : null,
				ctx,
			)
		);

		if (!miscStuffSetUp) {
			setUpMiscStuff(ctx, sectionContentPromise);
			miscStuffSetUp = true;
		}

		await sectionContentPromise; //? we wait for the two cards to show up on the screen

		portionsRendered++;

		if (portionsRendered < 2) {
			renderNew(); //? render one more portion
		} else {
			portionsRendered = 0;
			startObservingTheThirdLastCard(ctx, renderNew); //? When user sees the third card, repeat the rendering cycle.
		}
	}

	if (posts.length == 0) { //? If there are no posts, start rendering them.
		renderNew();
	}
}