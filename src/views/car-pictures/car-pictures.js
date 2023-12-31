import { renderNew, resetState } from "./renderNew.js";

export async function carPicturesView(ctx) {
	if (!ctx.user?.isModerator && ctx.hash == 'approval-mode') {
		ctx.page.redirect('/car-pictures');
		return;
	}

	const posts = [];
	resetState(posts);

	ctx.carPicturesController = new AbortController();
	window.addEventListener('popstate', () => {
		resetState(posts, ctx.user?.isModerator);

		const srchRegex = /(?<=search=)(?<srchStr>.*?)(?=&|$)/m;

		const queryStr = window.location.search.slice(1);

		let urlSrchText = null; //? this text will be used in renderNew for auto search when first rendering
		if (queryStr) {
			urlSrchText = srchRegex.exec(decodeURIComponent(queryStr)).groups.srchStr.trim();
		}

		//? (in getSectionContentTemplate) the window path may change while some post promises are still pending so we create this variable to prevent the rendering of posts in a wrong view
		let windowPath = window.location.href.replace(window.location.origin, '');
		windowPath = window.location.hash ? windowPath : windowPath.replace("#", '');

		renderNew(ctx, posts, urlSrchText ? [] : null, urlSrchText || null, windowPath);
	}, { signal: ctx.carPicturesController.signal });

	if (posts.length == 0) { //? If there are no posts, start rendering them.
		const srchRegex = /(?<=search=)(?<srchStr>.*?)(?=&|$)/m;

		let urlSrchText = null; //? this text will be used in renderNew for auto search when first rendering
		if (ctx.querystring) {
			urlSrchText = srchRegex.exec(decodeURIComponent(ctx.querystring)).groups.srchStr.trim();
		}

		renderNew(ctx, posts, urlSrchText ? [] : null, urlSrchText || null);
	}
}