let clicked = false;

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
