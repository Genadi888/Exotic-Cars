import { html } from "../lib/lit-html.js";

const loginTemplate = () => html`
	<link rel="stylesheet" href="/css/login.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

	<main>
		<form>
			<h1>Log in</h1>
			<div class="inputs">
				<label for="username">Username:</label>
				<input class="form-control" type="text" name="username" id="username">
				<label for="password">Password:</label>
				<input class="form-control" type="password" name="password" id="password">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
					<label class="form-check-label" for="flexCheckChecked">
						Remember me
					</label>
				</div>
			</div>
		</form>
	</main>
`

export function loginView(ctx) {
	ctx.render(loginTemplate());
}