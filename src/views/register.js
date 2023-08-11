import { register } from "../api/users.js";
import { html } from "../lib/lit-html.js";
import { getPasswordInputHandler, getUsernameInputHandler, getRegisterFormInputHandler, bindForm, getEmailInputHandler } from "../util.js";

const registerTemplate = (getUsernameInputHandler, getPasswordInputHandler, getEmailInputHandler, getLoginOrRegisterFormInputHandler, onSubmit, error) => html`
	<link rel="stylesheet" href="/css/register.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
	
	<main>
		<form @submit=${onSubmit} @input=${getLoginOrRegisterFormInputHandler()}>
			<h1>Register</h1>
			${error ? html`<span class="server-error-msg">${error}</span>` : null}
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
	
				<div class="redirect-div">Have an account? <a href="/login">Log in!</a></div>
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
			getRegisterFormInputHandler,
			bindForm(onSubmit)
		)
	);

	async function onSubmit({ username, password, email }, form) {
		try {
			await register(username, password, email);
			form.reset();
			ctx.page.redirect('/verify');
		} catch (error) {
			ctx.render(
				registerTemplate(
					getUsernameInputHandler,
					getPasswordInputHandler,
					getEmailInputHandler,
					getRegisterFormInputHandler,
					bindForm(onSubmit),
					error.message
				)
			);
		}
	}
}