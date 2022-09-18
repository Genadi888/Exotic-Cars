'use strict'

export function startObserving(nestedShadowRoot) {
	const observer = new IntersectionObserver(observerCallback, {
		root: null,
		rootMargin: "0px",
		threshold: 0.8
	});
	
	const fadeEl = nestedShadowRoot.querySelector('#goal-div');
	// console.log(fadeEl)
	observer.observe(fadeEl);
	
	function observerCallback(entries) {
		const goalDiv = entries[0];
	
		if (goalDiv.isIntersecting) {
			//? fade in observed element that are in view
			goalDiv.target.classList.replace('fadeOut', 'fadeIn');
		} else {
			//? fade out observed element that are not in view
			goalDiv.target.classList.replace('fadeIn', 'fadeOut');
		}
	}
}

let clickedNavBtn = false;

export function collapseButtonClickFunction(topShadowRoot) {
	const ul = topShadowRoot.querySelector('.navbar-nav');
	const socialMediaLi = topShadowRoot.querySelector('#navbarNav>ul>li:nth-child(4)');

	if (!clickedNavBtn) {
		ul.style.marginLeft = '0px';

		socialMediaLi.style.marginLeft = '0px';
		socialMediaLi.style.paddingLeft = '0px';
		socialMediaLi.style.paddingTop = '8px';

		clickedNavBtn = true;
	} else {
		getUlBack(ul, topShadowRoot);
		clickedNavBtn = false;
	}
}

function getUlBack(ul, nestedShadowRoot) {
	const nav = nestedShadowRoot.querySelector('nav');
	const socialMediaLi = nestedShadowRoot.querySelector('#navbarNav>ul>li:nth-child(4)');

	setInterval(() => {
		// console.log(nav.offsetHeight);
		if (nav.offsetHeight > 128) {
			ul.style.marginLeft = '0%';

			socialMediaLi.style.marginLeft = '0px';
			socialMediaLi.style.paddingLeft = '0px';
			socialMediaLi.style.paddingTop = '8px';
		} else if (nav.offsetHeight >= 66 && nav.offsetHeight <= 80) {
			socialMediaLi.style.marginLeft = '20px';
			socialMediaLi.style.paddingLeft = '0px';
			socialMediaLi.style.paddingTop = '0px';
		}
	}, 10);
}