'use strict'

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


//? Below is the code for the "goal-div" scroll fade-in animation


const observerOptions = {
	root: null,
	rootMargin: "0px",
	threshold: 0.8
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const fadeElms = document.querySelectorAll('.goal-div');
observer.observe(fadeElms[0]);

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