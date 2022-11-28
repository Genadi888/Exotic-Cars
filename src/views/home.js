import { defineCarousel } from "../components/home-carousel.js";
import { html } from "../lib/lit-html.js"

const homeTemplate = () => html`
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<link rel="stylesheet" href="/css/style.css">
	
	<image-carousel></image-carousel>
	
	<article>
		<div id="goal-div" class="fade-in fadeOut">
			<h1>What is our goal?</h1>
			<hr>
			<p>
				We want more people to discover the beauty of sports cars. It is important to show them how some models
				really left a mark in the automobile industry.
			</p>
			<a href="/car-pictures">VIEW CAR PICTURES</a>
		</div>
	</article>
`

export function homeView(ctx) {
	ctx.render(homeTemplate());

	startObserving(ctx.nestedShadowRoot);
	defineCarousel();
}

function startObserving(nestedShadowRoot) {
	const observer = new IntersectionObserver(observerCallback, {
		root: null,
		rootMargin: "0px",
		threshold: 0.8
	});

	const fadeEl = nestedShadowRoot.querySelector('#goal-div');
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
}