import { html } from "../../lib/lit-html.js";

export const carPicturesTemplate = (sectionClickHandler, postsTemplate) => html`
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
	
	<a id="go-to-top-link"><img src="../../images/arrow-up-circle.svg" alt="" srcset=""></a>
	
	<section @click=${sectionClickHandler}>
		${postsTemplate}
	</section>
	
	<div id="more-info-window"></div>
`