export function setUpScrollToTop(ctx) {
	let allowedToScroll = false;
	
	return () => {
		const scrollToTopBtn = ctx.nestedShadowRoot.getElementById('go-to-top-link');

		window.addEventListener('scroll', () => {
			if (window.scrollY > 1000) {
				scrollToTopBtn.style.opacity = 1;
				scrollToTopBtn.style.cursor = 'pointer';
				allowedToScroll = true;
			} else {
				scrollToTopBtn.style.opacity = 0;
				scrollToTopBtn.style.cursor = 'unset';
				allowedToScroll = false;
			}
		});

		if (allowedToScroll) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
}