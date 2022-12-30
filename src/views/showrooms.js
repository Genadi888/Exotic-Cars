import { html } from "../lib/lit-html.js";

const showroomsTemplate = (buttonsFunc) => html`
	<link rel="stylesheet" href="/css/showrooms.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<main>
		<section id="central-section">
			<div id="text-and-buttons">
				<h1>Check out our showrooms in Bulgaria:</h1>
				<div class="btn-group-vertical" role="group" aria-label="Basic example">
					<button disabled type="button" class="town-btn btn btn-primary" @click="${() => buttonsFunc('Sofia')}">Sofia</button>
					<button disabled type="button" class="town-btn btn btn-primary" @click="${() => buttonsFunc('Plovdiv')}">Plovdiv</button>
					<button disabled type="button" class="town-btn btn btn-primary" @click="${() => buttonsFunc('Varna')}">Varna</button>
				</div>
			</div>
			<div id="map-div">
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4382.515728703805!2d24.772159616827473!3d42.12028224106309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14acd1d5bd03ea15%3A0x5749bf53701a3424!2z0JDQstGC0L7QutC-0LzQv9C70LXQutGBIEF1dG9IYXVzLmJn!5e1!3m2!1sbg!2sbg!4v1651415852804!5m2!1sbg!2sbg"
					style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
					id="map"></iframe>
			</div>
		</section>
	</main>
`

export function showroomsView(ctx) {
	ctx.render(showroomsTemplate(buttonsFunc));
	
	const map = ctx.nestedShadowRoot.getElementById('map');
	const townButtons = [...ctx.nestedShadowRoot.querySelectorAll('.town-btn')];
	
	map.addEventListener('load', () => {
		for (const button of townButtons) {
			button.removeAttribute('disabled');
		}
	})
	
	function buttonsFunc(town) {
		const towns = {
			Sofia: () => map.setAttribute('src', "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.1555944710685!2d23.31670058700197!3d42.68091421645368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa85869e9a7c6d%3A0x322670168124451d!2z0JDQstGC0L7QutGK0YnQsCAi0JXQktCg0J7QkNCj0KLQniI!5e1!3m2!1sbg!2sbg!4v1651431666389!5m2!1sbg!2sbg"),
			Plovdiv: () => map.setAttribute('src', "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4382.515728703805!2d24.772159616827473!3d42.12028224106309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14acd1d5bd03ea15%3A0x5749bf53701a3424!2z0JDQstGC0L7QutC-0LzQv9C70LXQutGBIEF1dG9IYXVzLmJn!5e1!3m2!1sbg!2sbg!4v1651415852804!5m2!1sbg!2sbg"),
			Varna: () => map.setAttribute('src', "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1243.354329741198!2d27.869661697400424!3d43.233866142454346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a45521183e9523%3A0xbd53d8a5fa3da8eb!2z0JXQutGB0LXQu9C10L3RgiDQmtCw0YDRgSAjIEV4Y2VsbGVudCBDYXJz!5e1!3m2!1sbg!2sbg!4v1651431876612!5m2!1sbg!2sbg"),
		}
		towns[town]();
	}
}