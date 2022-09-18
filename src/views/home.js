import { html } from "../lib/lit-html.js"
import { startObserving } from "../util.js";

const homeTemplate = () => html`
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
	</script>
	<link rel="stylesheet" href="/css/style.css">
	
	<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" data-bs-touch="true">
		<div class="carousel-inner">
			<div class="carousel-item active" data-bs-interval="5000">
				<img src="/images/dodge-challenger.webp" class="d-block w-100" alt="...">
			</div>
			<div class="carousel-item" data-bs-interval="5000">
				<img src="/images/ford-gt.webp" class="d-block w-100" alt="...">
			</div>
			<div class="carousel-item" data-bs-interval="5000">
				<img src="/images/toyota-hilux.webp" class="d-block w-100" alt="...">
			</div>
		</div>
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
	</div>
	
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
	startObserving(ctx.topShadowRoot.querySelector('main').shadowRoot);
}