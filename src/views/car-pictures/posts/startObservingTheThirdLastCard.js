let renderNew;

const observer = new IntersectionObserver((entries, observer) => {
	// Function to handle intersection changes
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			// Element has entered the viewport
			renderNew();
			observer.disconnect();
		}
	});
}, { threshold: 0.5 }); // Trigger the callback when 50% of the element is visible



export function startObservingTheThirdLastCard(ctx, localRenderNew) {
	renderNew = localRenderNew;

	// Select the elements you want to observe
	const thirdLastCard = ctx.nestedShadowRoot.querySelector('.card:nth-last-child(3)');
	observer.observe(thirdLastCard);
}