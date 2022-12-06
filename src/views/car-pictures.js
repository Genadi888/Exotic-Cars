import { html } from "../lib/lit-html.js";

const carPicturesTemplate = (scrollFunc) => html`
	<link rel="stylesheet" href="/css/car-pictures.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<!-- <aside>
			<button id="offcanvas-btn" class="btn btn-primary" type="button" data-bs-toggle="offcanvas"
				data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
				<p>TOPICS</p>
			</button>
		
			<div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasRight"
				aria-labelledby="offcanvasRightLabel">
				<div class="offcanvas-header">
					<h1 id="offcanvasRightLabel">Car Topics</h1>
					<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					<p>See what is popular among the community!</p>
				</div>
				<div class="offcanvas-body">
					<ul id="list-group-off-canvas">
						<li class="list-group-item"><a href="#">How will cars look in the future?</a></li>
						<li class="list-group-item"><a href="#">Reasons why car accidents happen</a></li>
						<li class="list-group-item"><a href="#">Car or public transport: the ongoing debate</a></li>
						<li class="list-group-item"><a href="#">Self-driving cars: has the future already come?</a></li>
					</ul>
				</div>
			</div>
		
			<ul class="list-group">
				<li class="list-group-item">
					<h1>Car Topics</h1>
					<p>See what is popular among the community!</p>
				</li>
				<li class="list-group-item"><a href="#">How will cars look in the future?</a></li>
				<li class="list-group-item"><a href="#">Reasons why car accidents happen</a></li>
				<li class="list-group-item"><a href="#">Car or public transport: the ongoing debate</a></li>
				<li class="list-group-item"><a href="#">Self-driving cars: has the future already come?</a></li>
			</ul>
		</aside> -->
	
	<a @click=${scrollFunc} id="go-to-top-link"><img src="../../images/arrow-up-circle.svg" alt="" srcset=""></a>
	
	<section>
		<div class="card border-0">
			<img src="../../images/ford-gt.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">Ford GT 2005</h5>
				<p class="card-text"><b>Engine:</b> 5.4 i V8 <b>|</b> <b>Power:</b> 557 Hp @ 6500 rpm. <b>|</b>
					<b>Top speed:</b> 330 km/h <b>|</b> <b>Weight:</b> 1610 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
		<div class="card border-0">
			<img src="../../images/dodge-challenger-srt-demon.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">Dodge Challenger III SRT Hellcat Redeye</h5>
				<p class="card-text"><b>Engine:</b> 6.2 HEMI V8 <b>|</b> <b>Power:</b> 797 Hp @ 6300 rpm. <b>|</b>
					<b>Top speed:</b> 327 km/h <b>|</b> <b>Weight:</b> 2066 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
		<div class="card border-0">
			<img src="../../images/bmw-i8-roadster.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">BMW i8 Roadster</h5>
				<p class="card-text"><b>Engine:</b> 1.5/11.6 kWh <b>|</b> <b>Power:</b> 231 Hp @ 6000 rpm. <b>|</b>
					<b>Top speed:</b> 250 km/h <b>|</b> <b>Weight:</b> 1595 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
		<div class="card border-0">
			<img src="../../images/Lexus-LC-Convertible.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">Lexus LC Convertible</h5>
				<p class="card-text"><b>Engine:</b> 500 V8 <b>|</b> <b>Power:</b> 477 Hp @ 7100 rpm <b>|</b>
					<b>Top speed:</b> 270 km/h <b>|</b> <b>Weight:</b> 2040 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
		<div class="card border-0">
			<img src="../../images/mercedes-benz.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">Mercedes-Benz AMG GT (C190)</h5>
				<p class="card-text"><b>Engine:</b> S 4.0 V8 <b>|</b> <b>Power:</b> 510 Hp @ 6250 rpm <b>|</b>
					<b>Top speed:</b> 310 km/h <b>|</b> <b>Weight:</b> 1645 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
		<div class="card border-0">
			<img src="../../images/Mitsubishi-Lancer-Evolution-X.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">Mitsubishi Lancer Evolution X</h5>
				<p class="card-text"><b>Engine:</b> 2.0 MIVEC FQ-360 <b>|</b> <b>Power:</b> 359 Hp @ 6500 rpm <b>|</b>
					<b>Top speed:</b> 250 km/h <b>|</b> <b>Weight:</b> 1560 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
		<div class="card border-0">
			<img src="../../images/Lamborghini-Huracan-Tecnica-facelift-2022_2.webp" class="card-img-top" alt="...">
			<div class="card-body">
				<h5 class="card-title">Lamborghini Huracan Tecnica</h5>
				<p class="card-text"><b>Engine:</b> 5.2 V10 <b>|</b> <b>Power:</b> 640 Hp @ 8000 rpm <b>|</b>
					<b>Top speed:</b> 325 km/h <b>|</b> <b>Weight:</b> 1379 kg</p>
				<a href="#" class="btn btn-primary">Show more info</a>
			</div>
		</div>
	</section>
`

export function carPicturesView(ctx) {
	ctx.render(carPicturesTemplate(scrollToTop));

	const scrollToTopBtn = ctx.nestedShadowRoot.getElementById('go-to-top-link');
	let allowedToScroll = false;

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
	
	function scrollToTop() {
		if (allowedToScroll) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
}