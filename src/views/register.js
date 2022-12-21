import { html } from "../lib/lit-html.js";

const registerTemplate = () => html`
	<link rel="stylesheet" href="/css/register.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

	<main>
		<form>
			<h1>Register</h1>
			<div class="inputs">
				<label for="username">Username:</label>
				<input class="form-control" type="text" name="username" id="username">
				<label for="password">Password:</label>
				<input class="form-control" type="password" name="password" id="password">
				<label for="password">E-mail:</label>
				<input class="form-control" type="email" name="email" id="email">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
					<label class="form-check-label" for="flexCheckChecked">
						Remember me
					</label>
				</div>
				<input disabled class="btn btn-primary" type="submit" value="Register">
			</div>
		</form>
	</main>
`

export function registerView(ctx) {
	ctx.render(registerTemplate());
}