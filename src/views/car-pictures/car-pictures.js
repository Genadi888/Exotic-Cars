import { html } from "../../lib/lit-html.js";
import { until } from "../../lib/directives/until.js";
import { get2PostObjects } from "../../api/posts.js";
import { sectionClickHandler } from "./infoWindow/infoWindow.js";
import { carPicturesTemplate } from "./carPicturesTemplate.js";
import { getSwitchToApprovalModeHandler } from "./posts/switchToApprovalModeHandler.js";
import { getNoPostsTemplate } from "./posts/getNoPostsTemplate.js";
import { getUnapprovedPostsMessageTemplate } from "./posts/unapprovedPostsMessageTemplate.js";
import { getSectionContentTemplate } from "./posts/sectionContentTemplate.js";
import { setUpMiscStuff } from "./posts/setUpMiscStuff.js";
import { startObservingTheThirdLastCard } from "./posts/startObservingTheThirdLastCard.js";

export async function carPicturesView(ctx) {
	const posts = [];
	const generatorsObject = {
		asyncPostsGenerator: get2PostObjects(ctx),
		asyncPostsGeneratorIsDone: false,
	}
	let miscStuffSetUp = false;
	let portionsRendered = 0;

	const loadingTemplate = () => html`
		<h1 id="loading">Loading posts<div class="loader"></div></h1>
	`

	async function renderNew() {
		const sectionContentPromise = 
		getSectionContentTemplate(
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
		
		if (generatorsObject.asyncPostsGeneratorIsDone) {
			return;
		}

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
		
		if (!miscStuffSetUp) {
			setUpMiscStuff(ctx, sectionContentPromise);
			miscStuffSetUp = true;
		}

		await sectionContentPromise; //? we wait for the two cards to show up on the screen and for the loading to finish

		portionsRendered++;

		if (!generatorsObject.asyncPostsGeneratorIsDone && portionsRendered < 3) { 
			//? If there is more content coming from the generator, render two more cards.
			renderNew();
		} else if (portionsRendered == 3) {
			portionsRendered = 0;
			startObservingTheThirdLastCard(ctx, renderNew);
		}
	}
	
	if (posts.length == 0) { //? If there are no posts, start rendering them.
		renderNew();
	}
}