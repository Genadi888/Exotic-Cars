import { searchForPosts } from "../../../api/posts.js";

export async function searchHandler(renderNew, ev, resetState) {
	ev.preventDefault();

	const searchText = ev.target.querySelector('input.form-control').value.trim();
	const srchBtn = ev.target.querySelector('button[type="submit"]');
	
	const wordsRegEx = /(?:(?:[a-zA-Z_]|[\u0410-\u044F])|['-](?:[a-zA-Z_]|[\u0410-\u044F])|\d+(?:\.\d+)*)+/gm;
	if (!wordsRegEx.test(searchText)) {
		alert("Invalid search text!");
		return;
	}

	const curUrl = `?search=${searchText}${window.location.hash}`;
	history.pushState({}, "", curUrl);

	//? (in getSectionContentTemplate) the window path may change while some post promises are still pending so we create this variable to prevent the rendering of posts in a wrong view
	let windowPath = window.location.href.replace(window.location.origin, '');
	windowPath = window.location.hash ? windowPath : windowPath.replace("#", '');

	srchBtn.textContent = "Searching...";
	srchBtn.disabled = true;
	
	const srchResultsArr = await searchForPosts(searchText);
	const postObjIds = [...new Set(srchResultsArr.sort((a, b) => b.matchCoefficient - a.matchCoefficient).map(srchResObj => srchResObj.postId))];
	
	srchBtn.textContent = "Search";
	srchBtn.removeAttribute('disabled');

	if (srchResultsArr.length == 0) {
		renderNew([]); //? render "nothing was found" message
	} else {
		resetState();
		renderNew(postObjIds, null, windowPath, searchText);
	}
}