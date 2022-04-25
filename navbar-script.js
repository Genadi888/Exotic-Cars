//? we use this file for multiple pages' navbars

'use strict'

let clicked = false;

// TODO: When I added the social media icons a new bug appeared. It triggers when I use the collapse functionality. I need to fix it!

function collapseButtonClickFunction() {
	const ul = document.getElementsByClassName('navbar-nav')[0];

	if (!clicked) {
		ul.style.marginLeft = '0px';
		clicked = true;
	} else {
		getUlBack(ul);
		clicked = false;
	}
}

function getUlBack(ul) {
	const nav = document.getElementsByTagName('nav')[0];

	setInterval(() => {
		if (nav.offsetHeight > 80) {
			ul.style.marginLeft = '0%'
		} else if (nav.offsetHeight >= 66 && nav.offsetHeight <= 80) {
			ul.style.marginLeft = '55%';
		}
	}, 10);
}