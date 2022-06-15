const scrollToTopBtn = document.getElementById('go-to-top-link');
let allowedToScroll = false;

setInterval(() => {
	if (window.scrollY > 1000) {
		scrollToTopBtn.style.opacity = 1;
		scrollToTopBtn.style.cursor = 'pointer';
		allowedToScroll = true;
	} else {
		scrollToTopBtn.style.opacity = 0;
		scrollToTopBtn.style.cursor = 'unset';
		allowedToScroll = false;
	}
}, 500);

function scrollToTop() {
	if (allowedToScroll) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}