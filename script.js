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


const scrollOffset = 100;

const scrollElement = document.querySelectorAll(".goal-div")[0];
console.log(scrollElement);

const elementInView = (el, offset = 0) => {
	const elementTop = el.getBoundingClientRect().top;

	return (
		elementTop <=
		((window.innerHeight || document.documentElement.clientHeight) - offset)
	);
};

const displayScrollElement = () => {
	scrollElement.classList.add('scrolled');
}

const hideScrollElement = () => {
	scrollElement.classList.remove('scrolled');
	scrollElement.classList.add('fade-out');
}

const handleScrollAnimation = () => {
	if (elementInView(scrollElement, scrollOffset)) {
		displayScrollElement();
	} else {
		hideScrollElement();
	}
}

window.addEventListener('scroll', () => {
	handleScrollAnimation();
})