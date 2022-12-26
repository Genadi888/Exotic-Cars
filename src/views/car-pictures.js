import { html, render as litRender } from "../lib/lit-html.js";
import { repeat } from "../lib/directives/repeat.js";
import { until } from "../lib/directives/until.js";
import { getAllPosts } from "../api/posts.js";

const carPicturesTemplate = (scrollFunc, sectionClickHandler, postsTemplate, cardTemplate, noPostsTemplate) => html`
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
	
	<section @click=${sectionClickHandler}>
		${postsTemplate}
	</section>
	
	<div id="more-info-window"></div>
`

export async function carPicturesView(ctx) {
	const cardTemplate = carObj => html`
		<div class="card border-0">
			<img src=${carObj.images[0]} class="card-img-top" alt=${carObj.carName}>
			<div class="card-body">
				<h5 class="card-title">${carObj.carName}</h5>
				<p class="card-text"><b>Engine:</b> ${carObj.engineInfo} <b>|</b> <b>Power:</b> ${carObj.power} <b>|</b>
					<b>Top speed:</b> ${carObj.topSpeed} <b>|</b> <b>Weight:</b> ${carObj.weight}</p>
				<a href="#" class="btn btn-primary show-more-info-btn">Show more info</a>
			</div>
		</div>
	`

	const noPostsTemplate = () => {
		return ctx.user?.sessionToken ? 
		html`
			<h1 id="no-posts">There are no posts yet.<br><a @click=${() => ctx.page.redirect('/share-photos')} href="/share-photos">Create one!</a></h1>
		` :
		html`
			<h1 id="no-posts">There are no posts yet.<br><a @click=${() => ctx.page.redirect('/login')} href="/login">Log in</a> and create one!</h1>
		`
	}

	const getSectionContentTemplate = async (noPostsTemplate) => {
		const posts = await getAllPosts();

		if (posts.length == 0) {
			ctx.nestedShadowRoot.querySelector('section').style['justifyContent'] = 'flex-start';
		}

		return html`
			${
				posts.length > 0 ? 
				repeat(posts, post => post.objectId, cardTemplate) : 
				noPostsTemplate
			}
		`
	}

	const loadingTemplate = () => html`
		<h1 id="loading">Loading posts<div class="loader">Loading...</div></h1>
	`

	ctx.render(carPicturesTemplate(scrollToTop, sectionClickHandler, until(getSectionContentTemplate(noPostsTemplate()), loadingTemplate()), cardTemplate, noPostsTemplate()));
	
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

	function sectionClickHandler(ev) {
		ev.preventDefault();

		if (ev.target.classList.contains("show-more-info-btn")) {
			const carName = ev.target.parentElement.querySelector('h5').textContent;

			litRender(infoWindowTemplate(carName), ctx.nestedShadowRoot.querySelector('#more-info-window'));
			showOrHideWindow();
		}
	}

	const infoWindowTemplate = (carName) => {
		const curentCarObject = carsObject[carName];

		return html`
			<button @click=${showOrHideWindow} type="button" class="btn-close" aria-label="Close"></button>
			<h4>${carName}</h4>
			<ul>
				<li>
					<h6>Fuel Consumption:</h6>
					<p>${curentCarObject['Fuel Consumption']}</p>
				</li>
				<li>
					<h6>Fuel Type:</h6>
					<p>${curentCarObject['Fuel Type']}</p>
				</li>
				<li>
					<h6>Drive wheel:</h6>
					<p>${curentCarObject['Drive wheel']}</p>
				</li>
				<li>
					<h6>Transmission:</h6>
					<p>${curentCarObject['Transmission']}</p>
				</li>
				<li>
					<h6>Acceleration:</h6>
					<p>${curentCarObject['Acceleration']}</p>
				</li>
				<li>
					<h6>Production:</h6>
					<p>${curentCarObject['Production']}</p>
				</li>
			</ul>
		`
	};

	function showOrHideWindow() {
		const infoWindow = ctx.nestedShadowRoot.querySelector('#more-info-window');

		if (+infoWindow.style.opacity == 0) {
			infoWindow.style['z-index'] = 1;
			infoWindow.style.opacity = 1;
		} else {
			infoWindow.style.opacity = 0;
			infoWindow.addEventListener('transitionend', ev => {
				if (ev.propertyName == 'opacity' && infoWindow.style.opacity == 0) {
					infoWindow.style['z-index'] = -1;
				}
			});
		}
	}
}