import { setUpScrollToTop } from "../scrollToTop.js";

export function setUpMiscStuff(ctx, sectionContentPromise) {
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