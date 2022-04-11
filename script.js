let collapseButtonClicked = false;
let navbarUlOriginalMarginLeft = null;
let clicked = false;

function collapseButtonClickFunction() {
	const ul = document.getElementsByClassName('navbar-nav')[0];
	navbarUlOriginalMarginLeft = ul.style.marginLeft;
	//TODO: да оправя margin-а
	console.log(navbarUlOriginalMarginLeft);
	if (!clicked) {
		ul.style.marginLeft = '0';
		clicked = true;
	} else {
		
	}
}