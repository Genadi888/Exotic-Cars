import { html } from "../lib/lit-html.js";
import { getPasswordInputHandler, getUsernameInputHandler, getLoginOrRegisterFormInputHandler } from "../util.js";

const registerTemplate = (getUsernameInputHandler, getPasswordInputHandler, getEmailInputHandler, getLoginOrRegisterFormInputHandler) => html`
	<link rel="stylesheet" href="/css/register.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
	
	<main>
		<form @input=${getLoginOrRegisterFormInputHandler()}>
			<h1>Register</h1>
			<div class="inputs">
				<label for="username">Username:</label>
				<input @input=${getUsernameInputHandler()} class="form-control" type="text" name="username" id="username">
				<span class="invalid-span" id="first-invalid-span"></span>
	
				<label for="password">Password:</label>
				<input @input=${getPasswordInputHandler()} class="form-control" type="password" name="password"
					id="password">
				<span class="invalid-span" id="second-invalid-span"></span>
	
				<label for="password">Email:</label>
				<input @input=${getEmailInputHandler()} class="form-control" type="email" name="email" id="email">
				<span class="invalid-span" id="third-invalid-span"></span>
	
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
	ctx.render(
		registerTemplate(
			getUsernameInputHandler,
			getPasswordInputHandler,
			getEmailInputHandler,
			getLoginOrRegisterFormInputHandler
		)
	);

	function getEmailInputHandler() {
		let timeout;

		return ev => {
			clearTimeout(timeout);

			const inputEl = ev.currentTarget;
			const span = inputEl.parentElement.querySelector('#third-invalid-span');
			const email = inputEl.value.trim();

			timeout = setTimeout(() => {
				if (!email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'invalid email';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000)
		}
	}
}