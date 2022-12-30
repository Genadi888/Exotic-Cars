import { html } from "../lib/lit-html.js";

const verifyTemplate = () => html`
	<link rel="stylesheet" href="/css/verify.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<main>
		<div id="verify-info">
			<h1>Please, verify your email!</h1>
			<span  id="instructions" class="instructions">After you clicked the verification link we have sent, you can <a href="/login">log in</a>.</span>
		</div>
	</main>
`

export function verifyView(ctx) {
	ctx.render(verifyTemplate());
}