import { setUpScrollToTop } from "../scrollToTop.js";

export function setUpMiscStuff(ctx, sectionContentPromise) {
	if (!ctx.user?.isModerator) {
		ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'space-around';
	} else {
		sectionContentPromise.then(() => {
			const card = ctx.nestedShadowRoot.querySelector('section > .card');
			if (card) {
				ctx.nestedShadowRoot.querySelector('section').style.setProperty('--card-margin-top', '14px');
			}
		});
	}

	setUpScrollToTop(ctx);
}