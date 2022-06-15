//? Below is the code for the "goal-div" scroll fade-in animation


const observer = new IntersectionObserver(observerCallback, {
	root: null,
	rootMargin: "0px",
	threshold: 0.8
});

const fadeEl = document.querySelector('#goal-div');
observer.observe(fadeEl);

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