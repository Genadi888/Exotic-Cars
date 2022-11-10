import { html } from "../lib/lit-html.js";

const aboutUsTemplate = () => html`
	<link rel="stylesheet" href="/css/about-us.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<main>
		<h1>How it all started</h1>
		<div id="picture-and-text">
			<img src="/images/nighttime-laptop.webp" alt="developing a site">
		
			<div id="text-div">
				<p>
					We are a small team from Plovdiv. As you might guess, our mutual passion are the exotic cars in
					Bulgaria and all
					around the world.
				</p>
				<p>
					If you also enjoy viewing some fancy-looking rides online or in a real place, our website and social
					media accounts will offer quality content.
				</p>
				<p>
					<u>Perhaps you are looking for a position as a photographer?</u> The team is always happy to meet
					newcomers! Click on the link below for more information!
				</p>
				<a href="#">Apply now!</a>
			</div>
		</div>
	</main>
`

export function aboutUsView(ctx) {
	ctx.render(aboutUsTemplate());
}