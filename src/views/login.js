import { html } from "../lib/lit-html.js";

const loginTemplate = (getUsernameInputHandler, getPasswordInputHandler) => html`
	<link rel="stylesheet" href="/css/login.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

	<main>
		<form>
			<h1>Log in</h1>
			<div class="inputs">
				<label for="username">Username:</label>
				<input @input=${getUsernameInputHandler()} class="form-control" type="text" name="username" id="username">
				<span class="invalid-span" id="first-invalid-span"></span>
				
				<label for="password">Password:</label>
				<input @input=${getPasswordInputHandler()} class="form-control" type="password" name="password" id="password">
				<span class="invalid-span" id="second-invalid-span"></span>
				
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
					<label class="form-check-label" for="flexCheckChecked">
						Remember me
					</label>
				</div>
				<input disabled class="btn btn-primary" type="submit" value="Log in">
			</div>
		</form>
	</main>
`

export function loginView(ctx) {
	ctx.render(loginTemplate(getUsernameInputHandler, getPasswordInputHandler));

	function getUsernameInputHandler() {
		let timeout;

		return ev => {
			clearTimeout(timeout);

			const inputEl = ev.currentTarget;
			const span = inputEl.parentElement.querySelector('#first-invalid-span');
			const username = inputEl.value.trim();
			
			timeout = setTimeout(() => {
				if (username.length < 4) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'too short name';
				} else if (username.split(' ').some(word => word.length < 2)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'too short words';
				} else if (username.match(/[\r\n~`!%^&*()\-_=+\[{\]}\|:;\",<.>/?]/g) ||
				(username.includes("'") && !username.match(/^([a-zA-Z]+(?:'[a-zA-Z])?[a-zA-Z]*)$/g))) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'invalid symbols';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000)
		}
	}

	function getPasswordInputHandler() {
		let timeout;

		return ev => {
			clearTimeout(timeout);

			const inputEl = ev.currentTarget;
			const span = inputEl.parentElement.querySelector('#second-invalid-span');
			const password = inputEl.value.trim();
			
			timeout = setTimeout(() => {
				if (password.length < 8) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'too short password';
				} else if (!password.match(/\d/g)) {
					inputEl.classList.add('is-invalid');
					span.style.display = 'block';
					span.textContent = 'digit required';
				} else {
					inputEl.classList.remove('is-invalid');
					span.style.display = 'none';
				}
			}, 1000)
		}
	}
}