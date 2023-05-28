export function setUpScrollToTop(ctx) {
	let allowedToScroll = false;
	const scrollToTopBtn = ctx.nestedShadowRoot.getElementById('go-to-top-link');
	const transitionAllowed = !window.matchMedia('(prefers-reduced-motion)').matches;

	window.addEventListener('scroll', () => {
		if (window.scrollY > 1000) {
			if (transitionAllowed) {
				scrollToTopBtn.style.transition = 'opacity 900ms ease-out';
			}
			scrollToTopBtn.style.opacity = 1;
			scrollToTopBtn.style.cursor = 'pointer';
			allowedToScroll = true;
		} else {
			scrollToTopBtn.style.opacity = 0;
			scrollToTopBtn.style.cursor = 'unset';
			allowedToScroll = false;
		}
	});
	
	scrollToTopBtn.addEventListener('click', () => {
		if (allowedToScroll) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	})
}