import { until } from "/src/lib/directives/until.js";

let btnClicked = false;

export function getSwitchToApprovalModeHandler(ctx, getNoPostsTemplate, loadingTemplate, getSectionContentTemplate, carPicturesTemplate, sectionClickHandler, posts) {
	return function onSwitchToApprovalMode(switchEv) {
		const button = switchEv.currentTarget;

		if (!btnClicked) {
			if (ctx.hash != 'approval-mode') {
				window.location = '#approval-mode';
			}
			button.textContent = 'Switch to normal mode';
			btnClicked = true;
		} else {
			window.location = '#';
			button.textContent = 'Switch to approval mode';
			btnClicked = false;
		}
	
		const sectionContentPromise = getSectionContentTemplate(getNoPostsTemplate, btnClicked ? 'unapproved' : null);
		ctx.render(carPicturesTemplate(
			ev => sectionClickHandler(ev, posts, ctx),
			until(sectionContentPromise, loadingTemplate()),
			ctx.user?.isModerator ? onSwitchToApprovalMode : null
		));
	
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
	}
}