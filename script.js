let collapseButtonClicked = false;
let navbarUlOriginalMarginLeft = null;
let clicked = false;

function collapseButtonClickFunction() {
	const ul = document.getElementsByClassName('navbar-nav')[0];
	navbarUlOriginalMarginLeft = ul.style.marginLeft;
	
	if (!clicked) {
		ul.style.marginLeft = '0px';
		clicked = true;
	} else {
		getUlBack(ul);
		clicked = false;
	}
}

function getUlBack(ul) {
	let nav = document.getElementsByTagName('nav')[0];
	const initialHeight = nav.offsetHeight;
	
	setInterval(() => {
		nav = document.getElementsByTagName('nav')[0];

		if (nav.offsetHeight > 80) {
			ul.style.marginLeft = '0%'
			// console.log(ul.style.marginLeft);
		} else if (nav.offsetHeight >= 66 && nav.offsetHeight <= 80) {
			ul.style.marginLeft = '55%';
		}
	}, 10);
}
