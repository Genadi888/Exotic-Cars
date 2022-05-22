//? we use this file for multiple pages' navbars

'use strict'

let clicked = false;

function collapseButtonClickFunction() {
	const ul = document.getElementsByClassName('navbar-nav')[0];
	const socialMediaLi = document.querySelector('#navbarNav>ul>li:nth-child(4)');

	if (!clicked) {
		ul.style.marginLeft = '0px';

		socialMediaLi.style.marginLeft = '0px';
		socialMediaLi.style.paddingLeft = '0px';
		socialMediaLi.style.paddingTop = '8px';

		clicked = true;
	} else {
		getUlBack(ul);
		clicked = false;
	}
}

function getUlBack(ul) {
	const nav = document.getElementsByTagName('nav')[0];
	const socialMediaLi = document.querySelector('#navbarNav>ul>li:nth-child(4)');

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