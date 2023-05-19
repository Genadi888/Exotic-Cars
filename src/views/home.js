import { defineCarousel } from "../components/home-carousel.js";
import { html } from "../lib/lit-html.js"

const homeTemplate = () => html`
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<link rel="stylesheet" href="/css/home.css">
	
	<image-carousel></image-carousel>
	
	<article>
		<div id="goal-div">
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

export async function homeView(ctx) {
	ctx.render(homeTemplate());

	defineCarousel();

	const carousel = ctx.nestedShadowRoot.querySelector('image-carousel');

	await new Promise(resolve => {
		setInterval(async () => {
			if (await carousel.imageSize > 0) {
				resolve(); //? We will resolve this promise after the car images have been rendered.
			}
		}, 100);
	})

	//? We start observing after the carousel has loaded completely.

	startObserving(ctx.nestedShadowRoot);
}

function startObserving(nestedShadowRoot) {
	const observer = new IntersectionObserver(observerCallback, {
		root: null,
		rootMargin: "0px",
		threshold: 0.8
	});
	
	observer.observe(nestedShadowRoot.querySelector('#goal-div'));

	function observerCallback(entries) {
		const goalDiv = entries[0].target;

		if (entries[0].isIntersecting) {
			//? fade in observed element which is in view
			goalDiv.classList.add('fadeIn');
		}
	}
}